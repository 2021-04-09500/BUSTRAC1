
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'personal_info.dart';
import 'location_page.dart';
import 'home_page.dart';

class AccountPage extends StatefulWidget {
  final String token;
  final String parentId;

  const AccountPage({super.key, required this.token, required this.parentId});

  @override
  State<AccountPage> createState() => _AccountPageState();
}

class _AccountPageState extends State<AccountPage> {
  Map<String, dynamic>? parentData;
  bool isLoading = true;
  TextEditingController? _nameController;

  @override
  void initState() {
    super.initState();
    fetchParentDetails();
  }

  Future<void> fetchParentDetails() async {
    final url = Uri.parse('http://192.168.100.9:8081/parents/me');

    try {
      final response = await http.get(
        url,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer ${widget.token}",
        },
      );

      if (response.statusCode == 200) {
        setState(() {
          parentData = jsonDecode(response.body);
          _nameController = TextEditingController(text: parentData!['name'] ?? '');
          isLoading = false;
        });
      } else {
        print('Failed to load parent data. Status: ${response.statusCode}');
        setState(() {
          parentData = null;
          isLoading = false;
        });
      }
    } catch (e) {
      print('Error fetching parent: $e');
      setState(() {
        parentData = null;
        isLoading = false;
      });
    }
  }

  Future<void> updateParentName() async {
    if (_nameController == null) return;

    final updatedName = _nameController!.text.trim();
    if (updatedName.isEmpty || parentData == null) return;

    final parentId = parentData!['id'];
    final url = Uri.parse('http://192.168.100.9:8081/parents/$parentId');
    final body = jsonEncode({"name": updatedName});

    try {
      final response = await http.put(
        url,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer ${widget.token}",
        },
        body: body,
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Name updated successfully")));
        fetchParentDetails();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Failed to update name")));
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Error updating name")));
    }
  }

  @override
  Widget build(BuildContext context) {
    final parentName = parentData != null ? parentData!['name'] ?? 'Audrey Pierre' : 'Audrey Pierre';
    final parentId = parentData != null ? parentData!['id'] ?? '' : '';

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Account', style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.orange,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: isLoading
            ? const Center(child: CircularProgressIndicator(color: Colors.orange))
            : Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 20),
                  Center(
                    child: Column(
                      children: [
                        const CircleAvatar(
                          radius: 40,
                          backgroundColor: Colors.grey,
                          child: Icon(Icons.person, size: 60, color: Colors.white),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          parentName,
                          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 5),
                        const Icon(Icons.edit, color: Colors.orange, size: 20),
                        const SizedBox(height: 20),
                      ],
                    ),
                  ),
                  ListTile(
                    leading: const Icon(Icons.person),
                    title: const Text('Personal info'),
                    trailing: const Icon(Icons.arrow_forward_ios),
                    onTap: () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (context) => PersonalInfoPage(token: widget.token,)),
                      );
                    },
                  ),
                  ListTile(
                    leading: const Icon(Icons.location_on),
                    title: const Text('Location'),
                    trailing: const Icon(Icons.arrow_forward_ios),
                    onTap: () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (context) => LocationPage(token: widget.token, parentId: parentId, id: parentId)),
                      );
                    },
                  ),
                  ListTile(
                    leading: const Icon(Icons.language),
                    title: const Text('Language'),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        Text('English', style: TextStyle(color: Colors.orange)),
                        Icon(Icons.arrow_forward_ios, color: Colors.orange),
                      ],
                    ),
                    onTap: () {},
                  ),
                  ListTile(
                    leading: const Icon(Icons.help),
                    title: const Text('Help and Support'),
                    trailing: const Icon(Icons.arrow_forward_ios),
                    onTap: () {},
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      side: const BorderSide(color: Colors.black),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(5),
                      ),
                    ),
                    child: const Text('Logout', style: TextStyle(color: Colors.black)),
                  ),
                ],
              ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.location_on), label: 'Track'),
          BottomNavigationBarItem(icon: Icon(Icons.notifications), label: 'Notification'),
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Account'),
        ],
        currentIndex: 3,
        selectedItemColor: Colors.orange,
        unselectedItemColor: Colors.grey,
        onTap: (index) {
          if (index == 2) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => HomePage(parentId: parentId, token: widget.token, busId: '',)),
            );
          }
        },
      ),
    );
  }
}
