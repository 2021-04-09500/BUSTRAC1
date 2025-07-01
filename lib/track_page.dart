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

class _TrackingPageState extends State<TrackingPage> with TickerProviderStateMixin {
  GoogleMapController? _mapController;
  LatLng? _busLocation;
  LatLng? _startLocation;
  LatLng? _endLocation;
  LatLng? _parentLocation;
  LatLng? _previousBusLocation;

  Marker? _busMarker;
  Marker? _startMarker;
  Marker? _destinationMarker;
  Marker? _parentMarker;

  Polyline? _busToParentPolyline;
  Polyline? _parentToEndPolyline;
  Timer? _timer;

  String? _etaToParent;
  String? _etaToEnd;
  String? _distanceToParent;
  String? _distanceToEnd;

  BitmapDescriptor? _busIcon;

  @override
  void initState() {
    super.initState();
    _loadBusIcon();
    _startTracking();
    _timer = Timer.periodic(const Duration(seconds: 5), (_) => _startTracking());
  }

  Future<void> _loadBusIcon() async {
    _busIcon = BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed);
    // Using a material icon for the bus
    // Note: Icons.directions_bus cannot be directly used as a marker icon.
    // For simplicity, we use a colored default marker. To use a custom icon without assets,
    // you would need to render a widget to a bitmap, which requires additional packages.
    if (_busLocation != null) {
      _updateBusMarker(_busLocation!);
    }
  }

  Future<void> _startTracking() async {
    await _fetchBusLocation();
    await _fetchRoute();
    await _fetchParentLocation();
    await _fetchDistance();

    if (_busLocation != null && _parentLocation != null && _endLocation != null) {
      await _drawRoutesAndCalculateETAs();
    }
  }

  Future<void> _fetchBusLocation() async {
    final url = 'http://192.168.100.9:8081/api/bus/${widget.busId}/location';
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
          _previousBusLocation = _busLocation;
          _busLocation = LatLng(lat, lng);
          _updateBusMarker(_busLocation!);
        });
      }
    } else {
      print('Failed to fetch bus location: ${res.statusCode}');
    }
  }

  void _updateBusMarker(LatLng newPosition) {
    setState(() {
      _busMarker = Marker(
        markerId: const MarkerId('bus'),
        position: newPosition,
        infoWindow: const InfoWindow(title: 'Bus Location'),
        icon: _busIcon ?? BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
      );
    });
  }

  Future<void> _fetchRoute() async {
    final url = 'http://192.168.100.9:8081/routes/by-bus/${widget.busId}';
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

  Future<void> _fetchParentLocation() async {
    final url = 'http://192.168.100.9:8081/parents/me';
    final res = await http.get(
      Uri.parse(url),
      headers: {'Authorization': 'Bearer ${widget.token}'},
    );

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      final address = data['address'];

      if (address != null) {
        final lat = (address['latitude'] as num?)?.toDouble();
        final lng = (address['longitude'] as num?)?.toDouble();

        if (lat != null && lng != null) {
          setState(() {
 _parentLocation = LatLng(lat, lng);
            _parentMarker = Marker(
              markerId: const MarkerId('parent'),
              position: _parentLocation!,
              infoWindow: const InfoWindow(title: 'Your Address'),
              icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueAzure),
            );
          });
        } else {
          print('Parent address lat/lng missing');
        }
      } else {
        print('Parent address missing in response');
      }
    } else {
      print('Failed to load parent location: ${res.statusCode}');
    }
  }

  Future<void> _fetchDistance() async {
    final url = 'http://192.168.100.9:8081/parents/distance-to-bus/${widget.busId}';
    final res = await http.get(
      Uri.parse(url),
      headers: {'Authorization': 'Bearer ${widget.token}'},
    );

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);

      if (data != null) {
        try {
          setState(() {
            _distanceToParent = '${(data as num).toDouble().toStringAsFixed(2)} km';
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

  Future<void> _drawRoutesAndCalculateETAs() async {
    if (_busLocation == null || _parentLocation == null || _endLocation == null) return;

    const apiKey = 'AIzaSyAQ-fKSiCLJsG9xc_T1WgAowRyaBqliJTg';
    final origin = '${_busLocation!.latitude},${_busLocation!.longitude}';
    final parent = '${_parentLocation!.latitude},${_parentLocation!.longitude}';
    final destination = '${_endLocation!.latitude},${_endLocation!.longitude}';

    // Fetch route from bus to parent
    final busToParentUrl =
        'https://maps.googleapis.com/maps/api/directions/json?origin=$origin&destination=$parent&key=$apiKey';
    final busToParentRes = await http.get(Uri.parse(busToParentUrl));

    // Fetch route from parent to end
    final parentToEndUrl =
        'https://maps.googleapis.com/maps/api/directions/json?origin=$parent&destination=$destination&key=$apiKey';

    final parentToEndRes = await http.get(Uri.parse(parentToEndUrl));

    if (busToParentRes.statusCode == 200 && parentToEndRes.statusCode == 200) {
      final busToParentData = jsonDecode(busToParentRes.body);
      final parentToEndData = jsonDecode(parentToEndRes.body);

      if (busToParentData['routes'].isNotEmpty && parentToEndData['routes'].isNotEmpty) {
        // Process bus to parent route
        final busToParentRoute = busToParentData['routes'][0];
        final busToParentPoints = busToParentRoute['overview_polyline']['points'];
        final busToParentLeg = busToParentRoute['legs'][0];
        final busToParentPointsList = _decodePolyline(busToParentPoints);

        // Process parent to end route
        final parentToEndRoute = parentToEndData['routes'][0];
        final parentToEndPoints = parentToEndRoute['overview_polyline']['points'];
        final parentToEndLeg = parentToEndRoute['legs'][0];
        final parentToEndPointsList = _decodePolyline(parentToEndPoints);

        setState(() {
          _etaToParent = _formatDuration(Duration(seconds: busToParentLeg['duration']['value']));
          _etaToEnd = _formatDuration(Duration(seconds: busToParentLeg['duration']['value'] + parentToEndLeg['duration']['value']));
          _distanceToParent = '${(busToParentLeg['distance']['value'] / 1000).toStringAsFixed(2)} km';
          _distanceToEnd = '${((busToParentLeg['distance']['value'] + parentToEndLeg['distance']['value']) / 1000).toStringAsFixed(2)} km';

          _busToParentPolyline = Polyline(
            polylineId: const PolylineId('bus_to_parent'),
            points: busToParentPointsList,
            color: Colors.blue,
            width: 6,
          );

          _parentToEndPolyline = Polyline(
            polylineId: const PolylineId('parent_to_end'),
            points: parentToEndPointsList,
            color: Colors.blue,
            width: 6,
          );
        });

        final bounds = _boundsFromLatLngList([_busLocation!, _parentLocation!, _endLocation!]);
        Future.delayed(const Duration(milliseconds: 300), () {
          _mapController?.animateCamera(CameraUpdate.newLatLngBounds(bounds, 100));
        });
      } else {
        print('No routes found in Directions API response');
      }
    } else {
      print('Directions API request failed: busToParent=${busToParentRes.statusCode}, parentToEnd=${parentToEndRes.statusCode}');
    }
  }

  String _formatDuration(Duration duration) {
    if (duration.inHours > 0) {
      return '${duration.inHours}h ${duration.inMinutes.remainder(60)}m';
    } else {
      return '${duration.inMinutes} min';
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

  LatLng _interpolate(LatLng start, LatLng end, double fraction) {
    final lat = start.latitude + (end.latitude - start.latitude) * fraction;
    final lng = start.longitude + (end.longitude - start.longitude) * fraction;
    return LatLng(lat, lng);
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
              if (_busMarker != null)
                Marker(
                  markerId: const MarkerId('bus'),
                  position: _busLocation!,
                  infoWindow: const InfoWindow(title: 'Bus Location'),
                  icon: _busIcon ?? BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
                ),
              if (_startMarker != null) _startMarker!,
              if (_destinationMarker != null) _destinationMarker!,
              if (_parentMarker != null) _parentMarker!,
            },
            polylines: {
              if (_busToParentPolyline != null) _busToParentPolyline!,
              if (_parentToEndPolyline != null) _parentToEndPolyline!,
            },
            myLocationEnabled: true,
            myLocationButtonEnabled: true,
            zoomControlsEnabled: true,
          ),
          if (_previousBusLocation != null && _busLocation != null)
            TweenAnimationBuilder<double>(
              tween: Tween<double>(begin: 0, end: 1),
              duration: const Duration(seconds: 2),
              builder: (context, value, child) {
                final _ = _interpolate(_previousBusLocation!, _busLocation!, value);
                return Positioned(
                  child: Container(), // Empty container, as marker is handled in GoogleMap
                );
              },
              onEnd: () {
                _updateBusMarker(_busLocation!);
              },
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
                  if (_etaToParent != null && _distanceToParent != null)
                    Text('ETA to Your Address: $_etaToParent • Distance: $_distanceToParent',
                        style: const TextStyle(fontSize: 16, color: Colors.blueAccent)),
                  if (_etaToEnd != null && _distanceToEnd != null)
                    Text('ETA to Route End: $_etaToEnd • Distance: $_distanceToEnd',
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