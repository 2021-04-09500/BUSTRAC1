import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';

import 'messaging_page.dart';

class TrackingPage extends StatefulWidget {
  final String token;
  final String parentId;
  final String busNo;
  final String driverName;
  final String driverPhone;
  final int estimatedArrivalTime;

  const TrackingPage({
    super.key,
    required this.token,
    required this.parentId,
    required this.busNo,
    required this.driverName,
    required this.driverPhone,
    required this.estimatedArrivalTime,
  });

  @override
  State<TrackingPage> createState() => _TrackingPageState();
}

class _TrackingPageState extends State<TrackingPage> with TickerProviderStateMixin {
  late GoogleMapController mapController;

  LatLng _currentBusLocation = const LatLng(-6.7924, 39.2083);
  late Marker _busMarker;
  final Marker _destinationMarker = const Marker(
    markerId: MarkerId('destination'),
    position: LatLng(-6.7824, 39.2183),
    infoWindow: InfoWindow(title: 'Makumbusho Rd'),
  );

  final Set<Polyline> _polylines = {
    const Polyline(
      polylineId: PolylineId('route'),
      points: [
        LatLng(-6.7924, 39.2083),
        LatLng(-6.7874, 39.2133),
        LatLng(-6.7824, 39.2183),
      ],
      color: Colors.blue,
      width: 5,
    ),
  };

  Timer? _fetchTimer;

  @override
  void initState() {
    super.initState();
    _busMarker = Marker(
      markerId: const MarkerId('bus'),
      position: _currentBusLocation,
      infoWindow: const InfoWindow(title: 'Bus Location'),
    );
    _startFetchingBusLocation();
  }

  void _onMapCreated(GoogleMapController controller) {
    mapController = controller;
  }

  void _startFetchingBusLocation() {
    _fetchLatestLocation(); // Initial fetch
    _fetchTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      _fetchLatestLocation();
    });
  }

  Future<void> _fetchLatestLocation() async {
    final url = Uri.parse('http://192.168.0.11:8081/bus/{id}/location'); // Replace with your backend endpoint
    try {
      final res = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer ${widget.token}',
          'Content-Type': 'application/json',
        },
      );

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final lat = data['latitude'];
        final lng = data['longitude'];

        if (lat != null && lng != null) {
          final newPosition = LatLng(lat, lng);
          _animateBusMovement(_currentBusLocation, newPosition);
          _currentBusLocation = newPosition;
        }
      }
    } catch (e) {
      print("Error fetching GPS: $e");
    }
  }

  void _animateBusMovement(LatLng from, LatLng to) {
    final steps = 20;
    final diffLat = (to.latitude - from.latitude) / steps;
    final diffLng = (to.longitude - from.longitude) / steps;

    int count = 0;
    Timer.periodic(const Duration(milliseconds: 100), (timer) {
      if (count >= steps) {
        timer.cancel();
        return;
      }
      final intermediate = LatLng(
        from.latitude + (diffLat * count),
        from.longitude + (diffLng * count),
      );

      setState(() {
        _busMarker = Marker(
          markerId: const MarkerId('bus'),
          position: intermediate,
          infoWindow: const InfoWindow(title: 'Bus Location'),
        );
      });

      mapController.animateCamera(CameraUpdate.newLatLng(intermediate));
      count++;
    });
  }

  @override
  void dispose() {
    _fetchTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          GoogleMap(
            onMapCreated: _onMapCreated,
            initialCameraPosition: CameraPosition(target: _currentBusLocation, zoom: 14.0),
            markers: {_busMarker, _destinationMarker},
            polylines: _polylines,
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
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text('Arriving in ${widget.estimatedArrivalTime} mins',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
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
