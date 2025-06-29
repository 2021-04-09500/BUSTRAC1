import 'dart:async';
import 'dart:convert';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';
import 'messaging_page.dart';

class TrackingPage extends StatefulWidget {
  final String token;
  final String parentId;
  final String busId;
  final String busNo;
  final String driverName;
  final String driverPhone;

  const TrackingPage({
    super.key,
    required this.token,
    required this.parentId,
    required this.busId,
    required this.busNo,
    required this.driverName,
    required this.driverPhone,
  });

  @override
  State<TrackingPage> createState() => _TrackingPageState();
}

class _TrackingPageState extends State<TrackingPage> {
  GoogleMapController? _mapController;
  LatLng? _busLocation;
  LatLng? _startLocation; // Route start
  LatLng? _endLocation; // Route end (parent destination)

  Marker? _busMarker;
  Marker? _startMarker;
  Marker? _destinationMarker;

  Polyline? _routePolyline;
  Timer? _timer;

  String? _eta;
  String? _distance;

  @override
  void initState() {
    super.initState();
    _startTracking();
    _timer = Timer.periodic(const Duration(seconds: 5), (_) => _startTracking());
  }

  Future<void> _startTracking() async {
    await _fetchBusLocation();
    await _fetchRoute();
    await _fetchDistance();

    if (_busLocation != null && _endLocation != null) {
      await _drawRouteAndCalculateETA();
    }
  }

  Future<void> _fetchBusLocation() async {
    final url = 'http://192.168.100.3:8081/api/bus/${widget.busId}/location';
    final res = await http.get(
      Uri.parse(url),
      headers: {'Authorization': 'Bearer ${widget.token}'},
    );

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      final lat = (data['lat'] as num?)?.toDouble();
      final lng = (data['lng'] as num?)?.toDouble();

      if (lat != null && lng != null) {
        setState(() {
          _busLocation = LatLng(lat, lng);
          _busMarker = Marker(
            markerId: const MarkerId('bus'),
            position: _busLocation!,
            infoWindow: const InfoWindow(title: 'Bus Location'),
            icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
          );
        });
      }
    }
  }

  Future<void> _fetchRoute() async {
    final url = 'http://192.168.100.3:8081/routes/by-bus/${widget.busId}';
    final res = await http.get(
      Uri.parse(url),
      headers: {'Authorization': 'Bearer ${widget.token}'},
    );

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);

      final start = data['startLocation'];
      final end = data['endLocation'];

      if (start != null && end != null) {
        final startLat = (start['latitude'] as num).toDouble();
        final startLng = (start['longitude'] as num).toDouble();
        final endLat = (end['latitude'] as num).toDouble();
        final endLng = (end['longitude'] as num).toDouble();

        setState(() {
          _startLocation = LatLng(startLat, startLng);
          _endLocation = LatLng(endLat, endLng);

          _startMarker = Marker(
            markerId: const MarkerId('start'),
            position: _startLocation!,
            infoWindow: const InfoWindow(title: 'Route Start'),
            icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
          );

          _destinationMarker = Marker(
            markerId: const MarkerId('destination'),
            position: _endLocation!,
            infoWindow: const InfoWindow(title: 'Route End'),
            icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueBlue),
          );
        });
      }
    } else {
      print('Failed to load route data: ${res.statusCode}');
    }
  }

  Future<void> _fetchDistance() async {
  final url = 'http://192.168.100.3:8081/parents/distance-to-bus/${widget.busId}';
  final res = await http.get(
    Uri.parse(url),
    headers: {'Authorization': 'Bearer ${widget.token}'},
  );

  if (res.statusCode == 200) {
    final data = jsonDecode(res.body);

    if (data != null) {
      try {
        final double distanceValue = (data as num).toDouble();
        setState(() {
          _distance = '${distanceValue.toStringAsFixed(2)} km';
        });
      } catch (e) {
        print('Distance value cast error: $e');
      }
    } else {
      print('Distance response was null');
    }
  } else {
    print('Failed to fetch distance: ${res.statusCode}');
  }
}

  Future<void> _drawRouteAndCalculateETA() async {
    final origin = '${_busLocation!.latitude},${_busLocation!.longitude}';
    final destination = '${_endLocation!.latitude},${_endLocation!.longitude}';
    final apiKey = 'AIzaSyAQ-fKSiCLJsG9xc_T1WgAowRyaBqliJTg';

    final url =
        'https://maps.googleapis.com/maps/api/directions/json?origin=$origin&destination=$destination&key=$apiKey';

    final res = await http.get(Uri.parse(url));
    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);

      if (data['routes'].isNotEmpty) {
        final route = data['routes'][0];
        final points = route['overview_polyline']['points'];
        _eta = route['legs'][0]['duration']['text'];
        _distance = route['legs'][0]['distance']['text'];

        final coords = _decodePolyline(points);

        setState(() {
          _routePolyline = Polyline(
            polylineId: const PolylineId('route'),
            points: coords,
            color: Colors.blue,
            width: 6,
          );
        });

        final bounds = _boundsFromLatLngList([_busLocation!, _endLocation!]);
        _mapController?.animateCamera(CameraUpdate.newLatLngBounds(bounds, 100));
      }
    }
  }

  List<LatLng> _decodePolyline(String encoded) {
    List<LatLng> polyline = [];
    int index = 0, len = encoded.length;
    int lat = 0, lng = 0;

    while (index < len) {
      int b, shift = 0, result = 0;
      do {
        b = encoded.codeUnitAt(index++) - 63;
        result |= (b & 0x1F) << shift;
        shift += 5;
      } while (b >= 0x20);
      int dlat = ((result & 1) != 0) ? ~(result >> 1) : (result >> 1);
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.codeUnitAt(index++) - 63;
        result |= (b & 0x1F) << shift;
        shift += 5;
      } while (b >= 0x20);
      int dlng = ((result & 1) != 0) ? ~(result >> 1) : (result >> 1);
      lng += dlng;

      polyline.add(LatLng(lat / 1E5, lng / 1E5));
    }
    return polyline;
  }

  LatLngBounds _boundsFromLatLngList(List<LatLng> list) {
    final sw = LatLng(
      list.map((p) => p.latitude).reduce(min),
      list.map((p) => p.longitude).reduce(min),
    );
    final ne = LatLng(
      list.map((p) => p.latitude).reduce(max),
      list.map((p) => p.longitude).reduce(max),
    );
    return LatLngBounds(southwest: sw, northeast: ne);
  }

  @override
  void dispose() {
    _timer?.cancel();
    _mapController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          GoogleMap(
            onMapCreated: (controller) => _mapController = controller,
            initialCameraPosition: CameraPosition(
              target: _busLocation ?? const LatLng(0, 0),
              zoom: 14,
            ),
            markers: {
              if (_busMarker != null) _busMarker!,
              if (_startMarker != null) _startMarker!,
              if (_destinationMarker != null) _destinationMarker!,
            },
            polylines: {
              if (_routePolyline != null) _routePolyline!,
            },
            myLocationEnabled: true,
            myLocationButtonEnabled: true,
            zoomControlsEnabled: true,
          ),
          Positioned(
            top: 50,
            left: 20,
            child: FloatingActionButton(
              onPressed: () => Navigator.pop(context),
              backgroundColor: Colors.white,
              child: const Icon(Icons.arrow_back, color: Colors.black),
            ),
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              color: Colors.white,
              padding: const EdgeInsets.all(20.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Tracking Bus ${widget.busNo}',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  if (_eta != null && _distance != null)
                    Text('ETA: $_eta • Distance: $_distance',
                        style: const TextStyle(fontSize: 16, color: Colors.green)),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      const CircleAvatar(
                        radius: 20,
                        backgroundColor: Colors.grey,
                        child: Icon(Icons.person, color: Colors.white),
                      ),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(widget.busNo,
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                          Text('Toyota, Scania White', style: TextStyle(color: Colors.grey[600])),
                          Text(widget.driverName, style: TextStyle(color: Colors.grey[600])),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => ChatPage(
                                  driverName: widget.driverName,
                                  busNo: widget.busNo,
                                  driverPhone: widget.driverPhone,
                                ),
                              ),
                            );
                          },
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Colors.grey),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20),
                            ),
                          ),
                          child: const Text('Any pickup notes?'),
                        ),
                      ),
                      const SizedBox(width: 10),
                      FloatingActionButton(
                        onPressed: () async {
                          final Uri phoneUri = Uri(scheme: 'tel', path: widget.driverPhone);
                          if (await canLaunchUrl(phoneUri)) {
                            await launchUrl(phoneUri);
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Could not launch phone dialer')),
                            );
                          }
                        },
                        backgroundColor: Colors.orange,
                        mini: true,
                        child: const Icon(Icons.phone, color: Colors.white),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
