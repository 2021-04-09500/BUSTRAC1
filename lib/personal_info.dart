import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class PersonalInfoPage extends StatefulWidget {
  final String token;

  const PersonalInfoPage({super.key, required this.token});

  @override
  State<PersonalInfoPage> createState() => _PersonalInfoPageState();
}

class _PersonalInfoPageState extends State<PersonalInfoPage> {
  Map<String, dynamic>? parentData;
  bool isLoading = true;
  bool isEditingName = false;
  bool isEditingPhone = false;
  bool isEditingEmail = false;

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();

  @override
  void initState() {
    super.initState();
    fetchParentData();
  }

  Future<void> fetchParentData() async {
    final url = Uri.parse('http://192.168.100.3:8081/parents/me');
    try {
      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${widget.token}',
        },
      );

      if (response.statusCode == 200) {
        setState(() {
          parentData = jsonDecode(response.body);
          _nameController.text = parentData!['name'] ?? '';
          _phoneController.text = parentData!['phoneNo'] ?? '';
          _emailController.text = parentData!['email'] ?? '';
          isLoading = false;
        });
      } else {
        throw Exception("Failed to fetch parent data");
      }
    } catch (e) {
      print("Error: $e");
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> updateParentData() async {
    if (parentData == null) return;

    final url = Uri.parse('http://192.168.100.3:8081/parents/update'); // 👈 Changed endpoint
    final updatedData = {
      "id": parentData!['id'], // 👈 Include ID in payload if your backend requires it
      "name": _nameController.text.trim(),
      "phoneNo": _phoneController.text.trim(),
      "email": _emailController.text.trim(),
    };

    try {
      final response = await http.put(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${widget.token}',
        },
        body: jsonEncode(updatedData),
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Information updated")),
        );
        fetchParentData(); // Refresh
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Update failed")),
        );
      }
    } catch (e) {
      print("Error updating: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Personal Info'),
        backgroundColor: Colors.orange,
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator(color: Colors.orange))
          : Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.person),
                    title: isEditingName
                        ? TextField(controller: _nameController)
                        : Text(_nameController.text),
                    trailing: TextButton(
                      onPressed: () {
                        setState(() {
                          isEditingName = !isEditingName;
                        });
                        if (!isEditingName) updateParentData();
                      },
                      child: Text(
                        isEditingName ? 'Save' : 'Edit',
                        style: const TextStyle(color: Colors.orange),
                      ),
                    ),
                  ),
                  ListTile(
                    leading: const Icon(Icons.phone),
                    title: isEditingPhone
                        ? TextField(controller: _phoneController)
                        : Text(_phoneController.text),
                    trailing: TextButton(
                      onPressed: () {
                        setState(() {
                          isEditingPhone = !isEditingPhone;
                        });
                        if (!isEditingPhone) updateParentData();
                      },
                      child: Text(
                        isEditingPhone ? 'Save' : 'Edit',
                        style: const TextStyle(color: Colors.orange),
                      ),
                    ),
                  ),
                  ListTile(
                    leading: const Icon(Icons.email),
                    title: isEditingEmail
                        ? TextField(controller: _emailController)
                        : Text(_emailController.text),
                    trailing: TextButton(
                      onPressed: () {
                        setState(() {
                          isEditingEmail = !isEditingEmail;
                        });
                        if (!isEditingEmail) updateParentData();
                      },
                      child: Text(
                        isEditingEmail ? 'Save' : 'Edit',
                        style: const TextStyle(color: Colors.orange),
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
