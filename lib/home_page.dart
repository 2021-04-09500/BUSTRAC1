import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'track_page.dart';
import 'notification_page.dart';
import 'account_page.dart';

class Student {
  String id;
  String name;
  String grade;
  String route;
  String? busNo;
  String? driverName;
  String? driverPhone;
  String time;
  String? gender;
  String? age;

  Student({
    required this.id,
    required this.name,
    required this.grade,
    required this.route,
    required this.time,
    this.busNo,
    this.driverName,
    this.driverPhone,
    this.gender,
    this.age,
  });

  factory Student.fromJson(Map<String, dynamic> json) {
    return Student(
      id: json['id'] ?? 'N/A',
      name: json['name'] ?? 'N/A',
      grade: json['grade'] ?? 'N/A',
      route: json['route'] ?? 'N/A',
      time: json['time'] ?? 'N/A',
      gender: json['gender'],
      age: json['age']?.toString(),
    );
  }

  void updateBusDetails(Map<String, dynamic> json) {
    busNo = json['plateNumber'];
    driverName = json['driverName'];
    driverPhone = json['driverPhone'];
  }
}

class HomePage extends StatefulWidget {
  final String parentId;
  final String token;

  const HomePage({super.key, required this.parentId, required this.token, required String busId});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late Future<List<Student>> studentDataFuture;
  int _currentIndex = 2;
  Student? selectedStudent;

  final String hardcodedBusId = '680b6b964b3ec354b671fdd3';

  @override
  void initState() {
    super.initState();
    studentDataFuture = fetchStudentData();
  }

  Future<List<Student>> fetchStudentData() async {
    final url = Uri.parse('http://192.168.100.3:8081/students/my-students');
    try {
      final response = await http.get(url, headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ${widget.token}",
      });

      if (response.statusCode == 200) {
        final List jsonList = jsonDecode(response.body);
        List<Student> students = jsonList.map((json) => Student.fromJson(json)).toList();

        await Future.wait(students.map((s) => fetchAndAttachBusDetails(s)));

        if (students.isNotEmpty && selectedStudent == null) {
          selectedStudent = students.first;
        }

        return students;
      } else {
        throw Exception('Failed to load students');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<void> fetchAndAttachBusDetails(Student student) async {
    final url = Uri.parse('http://192.168.100.3:8081/buses/my-child-bus');
    try {
      final response = await http.get(url, headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ${widget.token}",
      });

      if (response.statusCode == 200) {
        final Map<String, dynamic> jsonResponse = jsonDecode(response.body);
        student.updateBusDetails(jsonResponse);
      }
    } catch (e) {
      print('Error fetching bus details: $e');
    }
  }

  void _navigateToTrackingPage(Student student) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => TrackingPage(
          token: widget.token,
          busId: hardcodedBusId,
          busNo: student.busNo ?? 'TXXXX',
          driverName: student.driverName ?? 'Unknown',
          driverPhone: student.driverPhone ?? '0000000000',
          parentId: widget.parentId,
        ),
      ),
    );
  }

  void _onTabTapped(int index) {
    if (index == _currentIndex) return;

    switch (index) {
      case 0:
        if (selectedStudent != null) {
          _navigateToTrackingPage(selectedStudent!);
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('No student data loaded yet')),
          );
        }
        break;
      case 1:
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => NotificationPage(token: widget.token, parentId: widget.parentId),
          ),
        );
        break;
      case 3:
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => AccountPage(token: widget.token, parentId: widget.parentId),
          ),
        );
        break;
      default:
        setState(() => _currentIndex = index);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        selectedItemColor: Colors.orange,
        unselectedItemColor: Colors.grey,
        onTap: _onTabTapped,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.gps_fixed), label: 'Track'),
          BottomNavigationBarItem(icon: Icon(Icons.notifications), label: 'Notification'),
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Account'),
        ],
      ),
      appBar: AppBar(
        backgroundColor: Colors.orange,
        title: const Text("Home", style: TextStyle(color: Colors.white)),
        leading: const Icon(Icons.menu, color: Colors.white),
      ),
      body: FutureBuilder<List<Student>>(
        future: studentDataFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: Colors.orange));
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No student data available.'));
          }

          final students = snapshot.data!;
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: students.length,
            itemBuilder: (context, index) {
              final student = students[index];

              return Column(
                children: [
                  Card(
                    elevation: 5,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const CircleAvatar(
                            radius: 30,
                            backgroundColor: Colors.grey,
                            child: Icon(Icons.person, size: 35, color: Colors.white),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(student.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                                Text("ID: ${student.id}", style: const TextStyle(color: Colors.grey)),
                                Text("Class: ${student.grade}", style: const TextStyle(color: Colors.blue)),
                                if (student.gender != null)
                                  Text("Gender: ${student.gender!}", style: const TextStyle(color: Colors.teal)),
                                if (student.age != null)
                                  Text("Age: ${student.age!}", style: const TextStyle(color: Colors.deepPurple)),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    const Icon(Icons.access_time, size: 16, color: Colors.orange),
                                    const SizedBox(width: 4),
                                    Text("Time: ${student.time}", style: const TextStyle(fontSize: 12)),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    const Icon(Icons.location_on, size: 16, color: Colors.red),
                                    const SizedBox(width: 4),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFFFF3E0),
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                      child: Text(student.route, style: const TextStyle(fontSize: 12)),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text("Bus No: ${student.busNo ?? '(Not yet assigned)'}", style: const TextStyle(fontWeight: FontWeight.w500)),
                        const SizedBox(height: 6),
                        Text("Driver's Name: ${student.driverName ?? '(Unknown)'}", style: const TextStyle(fontWeight: FontWeight.w500)),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            const Icon(Icons.phone, color: Colors.grey),
                            const SizedBox(width: 4),
                            Text(student.driverPhone ?? '(Not available)', style: const TextStyle(color: Colors.grey)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => _navigateToTrackingPage(student),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orange,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      child: const Text("Start Tracking", style: TextStyle(color: Colors.white)),
                    ),
                  ),
                  const SizedBox(height: 30),
                ],
              );
            },
          );
        },
      ),
    );
  }
}
