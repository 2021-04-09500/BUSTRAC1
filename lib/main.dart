import 'package:flutter/material.dart';
import 'dart:async';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:jwt_decoder/jwt_decoder.dart'; // Add this in pubspec.yaml

import 'home_page.dart'; // Your HomePage import

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: SplashScreen(),
    );
  }
}


// =================== Splash Screen ===================
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();

    Timer(const Duration(seconds: 2), () {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const LoginPage()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image(image: AssetImage('assets/images/bus_logo.jpg'), height: 150),
            SizedBox(height: 20),
            //CircularProgressIndicator(color: Colors.orange),
          ],
        ),
      ),
    );
  }
}

// =================== Login Page ===================
class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController(); //to connect with textfield so as to read, set or clear text
  bool _obscureText = true;
  bool _isLoading = false;

  Future<Map<String, String>> login() async {
    final email = emailController.text.trim();
    final password = passwordController.text.trim();

    if (email.isEmpty || password.isEmpty) {
      _showDialog("Error", "Please enter both email and password.");
      return {"parentId": "", "token": ""};
    }

    setState(() => _isLoading = true);

    final url = Uri.parse('http://192.168.100.9:8081/api/auth/login');

    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"email": email, "password": password}),
      );

      print('Login response status: ${response.statusCode}');
      print('Login response body: ${response.body}');

      setState(() => _isLoading = false);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final token = data['token']?.toString() ?? "";

        // Decode JWT token to get parent ID from 'sub' claim
        Map<String, dynamic> decodedToken = JwtDecoder.decode(token);
        print('Decoded token: $decodedToken');

        final parentId = decodedToken['sub'] ?? "";

        if (parentId.isEmpty) {
          _showDialog("Error", "Failed to extract parent ID from token.");
          return {"parentId": "", "token": ""};
        }

        return {"parentId": parentId, "token": token};
      } else {
        _showDialog("Login Failed", "Invalid email or password.");
        return {"parentId": "", "token": ""};
      }
    } catch (e) {
      setState(() => _isLoading = false);
      _showDialog("Error", "An error occurred: $e");
      return {"parentId": "", "token": ""};
    }
  }

  void _handleLogin() async {
    print('Attempting to log in...');
    final credentials = await login();
    final parentId = credentials["parentId"];
    final token = credentials["token"];
    if (parentId!.isNotEmpty) {
      print('Navigating to HomePage with parentId: $parentId, token: $token');
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => HomePage(parentId: parentId, token: token!, busId: '',)),
      );
    }
  }

  void _showDialog(String title, String message) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("OK"))
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 40.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(child: Image.asset("assets/images/bus_logo.jpg", height: 150)),
              const SizedBox(height: 30),
              const Text("Login", style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.orange)),
              const SizedBox(height: 20),
              const Text("Email"),
              const SizedBox(height: 8),
              TextField(
                controller: emailController,
                decoration: InputDecoration(
                  hintText: "example@email.com",
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 20),
              const Text("Password"),
              const SizedBox(height: 8),
              TextField(
                controller: passwordController,
                obscureText: _obscureText,
                decoration: InputDecoration(
                  hintText: "********",
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  suffixIcon: IconButton(
                    icon: Icon(_obscureText ? Icons.visibility : Icons.visibility_off),
                    onPressed: () => setState(() => _obscureText = !_obscureText),
                  ),
                ),
              ),
              const SizedBox(height: 10),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {},
                  child: const Text("Forget password?", style: TextStyle(color: Colors.grey)),
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _handleLogin,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text("Login", style: TextStyle(fontSize: 16, color: Colors.white)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
