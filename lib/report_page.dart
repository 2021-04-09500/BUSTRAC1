import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

class ReportPage extends StatefulWidget {
  final String parentId;
  final String token;
  final String? driverPhone; // Added to pass driver phone from HomePage

  const ReportPage({super.key, required this.parentId, required this.token, this.driverPhone});

  @override
  State<ReportPage> createState() => _ReportPageState();
}

class _ReportPageState extends State<ReportPage> {
  // Sample data for the week of June 24 - June 30, 2025 (current week)
  final List<Map<String, dynamic>> currentWeekData = [
    {'date': 'Mon, Jun 24', 'arrivalTime': '8:25 AM', 'status': 'Early', 'leftBehind': false},
    {'date': 'Tue, Jun 25', 'arrivalTime': '8:35 AM', 'status': 'On Time', 'leftBehind': false},
    {'date': 'Wed, Jun 26', 'arrivalTime': '8:50 AM', 'status': 'Delayed', 'leftBehind': true},
    {'date': 'Thu, Jun 27', 'arrivalTime': '8:30 AM', 'status': 'On Time', 'leftBehind': false},
    {'date': 'Fri, Jun 28', 'arrivalTime': '8:45 AM', 'status': 'Delayed', 'leftBehind': false},
    {'date': 'Sat, Jun 29', 'arrivalTime': 'N/A', 'status': 'N/A', 'leftBehind': false},
    {'date': 'Sun, Jun 30', 'arrivalTime': 'N/A', 'status': 'N/A', 'leftBehind': false},
  ];

  // Sample data for the previous week (June 17 - June 23, 2025)
  final List<Map<String, dynamic>> previousWeekData = [
    {'date': 'Mon, Jun 17', 'arrivalTime': '8:40 AM', 'status': 'Delayed', 'leftBehind': false},
    {'date': 'Tue, Jun 18', 'arrivalTime': '8:30 AM', 'status': 'On Time', 'leftBehind': false},
    {'date': 'Wed, Jun 19', 'arrivalTime': '8:35 AM', 'status': 'On Time', 'leftBehind': true},
    {'date': 'Thu, Jun 20', 'arrivalTime': '8:45 AM', 'status': 'Delayed', 'leftBehind': false},
    {'date': 'Fri, Jun 21', 'arrivalTime': '8:25 AM', 'status': 'Early', 'leftBehind': false},
    {'date': 'Sat, Jun 22', 'arrivalTime': 'N/A', 'status': 'N/A', 'leftBehind': false},
    {'date': 'Sun, Jun 23', 'arrivalTime': 'N/A', 'status': 'N/A', 'leftBehind': false},
  ];

  String _selectedWeek = 'Current Week';
  late GoogleMapController _mapController;
  Set<Marker> _markers = {};
  static const LatLng _pickupLocation = LatLng(-6.8237, 39.2695); // Example: Dar es Salaam coordinates
  static const LatLng _delaySpot = LatLng(-6.8167, 39.2800); // Example delay spot

  @override
  void initState() {
    super.initState();
    _setupMapMarkers();
  }

  void _setupMapMarkers() {
    _markers.add(
      Marker(
        markerId: const MarkerId('pickup'),
        position: _pickupLocation,
        infoWindow: const InfoWindow(title: 'Pickup Location'),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen),
      ),
    );
    _markers.add(
      Marker(
        markerId: const MarkerId('delay'),
        position: _delaySpot,
        infoWindow: const InfoWindow(title: 'Frequent Delay Spot'),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
      ),
    );
  }

  @override
  void dispose() {
    _mapController.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> getSelectedWeekData() {
    return _selectedWeek == 'Current Week' ? currentWeekData : previousWeekData;
  }

  void _contactDriver() async {
    final phone = widget.driverPhone ?? '+255 687 653 299'; // Fallback to a default number
    final Uri phoneUri = Uri(scheme: 'tel', path: phone);
    if (await canLaunchUrl(phoneUri)) {
      await launchUrl(phoneUri);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Could not launch phone dialer')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final selectedData = getSelectedWeekData();
    final delayedCount = selectedData.where((day) => day['status'] == 'Delayed').length;
    final earlyCount = selectedData.where((day) => day['status'] == 'Early').length;
    final onTimeCount = selectedData.where((day) => day['status'] == 'On Time').length;
    final leftBehindCount = selectedData.where((day) => day['leftBehind'] == true).length;

    final prevDelayedCount = previousWeekData.where((day) => day['status'] == 'Delayed').length;
    final prevEarlyCount = previousWeekData.where((day) => day['status'] == 'Early').length;
    final prevOnTimeCount = previousWeekData.where((day) => day['status'] == 'On Time').length;
    final prevLeftBehindCount = previousWeekData.where((day) => day['leftBehind'] == true).length;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.orange,
        title: const Text("Weekly Route Report", style: TextStyle(color: Colors.white)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Weekly Route Report",
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.orange),
            ),
            const SizedBox(height: 10),
            DropdownButton<String>(
              value: _selectedWeek,
              items: const [
                DropdownMenuItem(value: 'Current Week', child: Text('Current Week (Jun 24 - Jun 30)')),
                DropdownMenuItem(value: 'Previous Week', child: Text('Previous Week (Jun 17 - Jun 23)')),
              ],
              onChanged: (value) {
                setState(() {
                  _selectedWeek = value!;
                });
              },
              style: const TextStyle(color: Colors.black, fontSize: 16),
              dropdownColor: Colors.white,
              underline: Container(height: 1, color: Colors.grey),
            ),
            const SizedBox(height: 20),
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Daily Arrival Summary",
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    Table(
                      border: TableBorder.all(color: Colors.grey[300]!, width: 1),
                      columnWidths: const {
                        0: FlexColumnWidth(1.5),
                        1: FlexColumnWidth(1),
                        2: FlexColumnWidth(1),
                      },
                      children: [
                        TableRow(
                          decoration: BoxDecoration(color: Colors.grey[200]),
                          children: const [
                            Padding(
                              padding: EdgeInsets.all(8.0),
                              child: Text('Date', style: TextStyle(fontWeight: FontWeight.bold)),
                            ),
                            Padding(
                              padding: EdgeInsets.all(8.0),
                              child: Text('Arrival Time', style: TextStyle(fontWeight: FontWeight.bold)),
                            ),
                            Padding(
                              padding: EdgeInsets.all(8.0),
                              child: Text('Status', style: TextStyle(fontWeight: FontWeight.bold)),
                            ),
                          ],
                        ),
                        ...selectedData.map((day) => TableRow(
                              children: [
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Text(day['date']),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Text(day['arrivalTime']),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Text(
                                    day['status'],
                                    style: TextStyle(
                                      color: day['status'] == 'Delayed'
                                          ? Colors.red
                                          : day['status'] == 'On Time'
                                              ? Colors.green
                                              : Colors.blue,
                                    ),
                                  ),
                                ),
                              ],
                            )),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Student Left Behind Trend",
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _buildTrendBar('Left Behind', leftBehindCount, Colors.red),
                        _buildTrendBar('On Time', onTimeCount, Colors.green),
                        _buildTrendBar('Early', earlyCount, Colors.blue),
                        _buildTrendBar('Delayed', delayedCount, Colors.red),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Center(
                      child: Text(
                        'Total Left Behind: $leftBehindCount times this week',
                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Historical Comparison",
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'Last Week (Jun 17 - Jun 23): '
                      '${prevOnTimeCount} On Time, ${prevEarlyCount} Early, ${prevDelayedCount} Delayed, '
                      '${prevLeftBehindCount} Left Behind',
                      style: const TextStyle(fontSize: 14),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      'This Week (Jun 24 - Jun 30): '
                      '$onTimeCount On Time, $earlyCount Early, $delayedCount Delayed, '
                      '$leftBehindCount Left Behind',
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Route Map Snapshot",
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    SizedBox(
                      height: 200,
                      child: GoogleMap(
                        onMapCreated: (controller) => _mapController = controller,
                        initialCameraPosition: const CameraPosition(
                          target: _pickupLocation,
                          zoom: 12,
                        ),
                        markers: _markers,
                        zoomControlsEnabled: false,
                        myLocationEnabled: false,
                        myLocationButtonEnabled: false,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Weekly Summary",
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'This week, the bus was on time $onTimeCount days, early $earlyCount days, and delayed $delayedCount days. '
                      'Your child was left behind $leftBehindCount time(s). Please contact the driver if further assistance is needed.',
                      style: const TextStyle(fontSize: 14),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: _contactDriver,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orange,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text("Contact Driver", style: TextStyle(color: Colors.white)),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Report data refreshed!')),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orange,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text("Refresh Report", style: TextStyle(color: Colors.white)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTrendBar(String label, int value, Color color) {
    return Column(
      children: [
        Container(
          width: 40,
          height: value * 20.0, // Scale height based on count (max 5 for this example)
          color: color,
        ),
        const SizedBox(height: 5),
        Text('$label: $value', style: TextStyle(fontSize: 12, color: color)),
      ],
    );
  }
}