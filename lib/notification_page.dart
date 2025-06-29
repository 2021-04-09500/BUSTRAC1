import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'home_page.dart';
import 'stomp_websocket_service.dart';
import 'track_page.dart';
import 'account_page.dart';

class NotificationPage extends StatefulWidget {
  final String token;
  final String parentId;

  const NotificationPage({
    super.key,
    required this.token,
    required this.parentId,
  });

  @override
  State<NotificationPage> createState() => _NotificationPageState();
}

class _NotificationPageState extends State<NotificationPage> {
  final List<Map<String, dynamic>> _messages = [];
  final StompWebSocketService _wsService = StompWebSocketService();
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _connectWebSocket();
    _fetchInitialMessages();
  }

  @override
  void dispose() {
    _wsService.disconnect();
    super.dispose();
  }

  void _connectWebSocket() {
    _wsService.connect(
      token: widget.token,
      onMessage: (msg) {
        if (!_messages.any((m) => m['id'] == msg['id'])) {
          setState(() {
            _messages.insert(0, msg);
          });
        }
      },
    );
  }

  Future<void> _fetchInitialMessages() async {
    final url = Uri.parse('http://192.168.100.3:8081/messages/parent/broadcasts');
    try {
      final res = await http.get(url, headers: {
        'Authorization': 'Bearer ${widget.token}',
        'Content-Type': 'application/json',
      });

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as List<dynamic>;
        setState(() {
          _messages
            ..clear()
            ..addAll(data.cast<Map<String, dynamic>>());
          _loading = false;
        });
      } else {
        setState(() {
          _loading = false;
        });
      }
    } catch (_) {
      setState(() {
        _loading = false;
      });
    }
  }

  String _formatTime(String timestamp) {
    if (timestamp.isEmpty) return '';
    final dt = DateTime.parse(timestamp).toLocal();
    if (DateFormat.yMd().format(dt) == DateFormat.yMd().format(DateTime.now())) {
      return 'Today ${DateFormat.Hm().format(dt)}';
    }
    return DateFormat('MMM dd • HH:mm').format(dt);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Notification'),
        backgroundColor: Colors.orange,
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          TextField(
            decoration: InputDecoration(
              hintText: 'All notification',
              prefixIcon: const Icon(Icons.filter_list),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
            ),
          ),
          const SizedBox(height: 20),
          _loading
              ? const Center(child: CircularProgressIndicator(color: Colors.orange))
              : Expanded(
                  child: _messages.isEmpty
                      ? const Center(child: Text('No notifications yet'))
                      : ListView.separated(
                          itemCount: _messages.length,
                          separatorBuilder: (_, __) => const Divider(height: 1, color: Colors.grey),
                          itemBuilder: (context, idx) {
                            final msg = _messages[idx];
                            return ListTile(
                              leading: const CircleAvatar(
                                backgroundColor: Colors.grey,
                                child: Icon(Icons.person, color: Colors.white),
                              ),
                              title: Text(msg['senderId'] ?? 'Admin'),
                              subtitle: Text(msg['content'] ?? ''),
                              trailing: Text(_formatTime(msg['timestamp'] ?? '')),
                            );
                          },
                        ),
                ),
        ]),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: [
          const BottomNavigationBarItem(icon: Icon(Icons.location_on), label: 'Track'),
          BottomNavigationBarItem(
            icon: Stack(children: [
              const Icon(Icons.notifications),
              if (_messages.isNotEmpty)
                Positioned(
                  right: 0,
                  child: Container(
                    padding: const EdgeInsets.all(2),
                    decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                    child: Text('${_messages.length}',
                        style: const TextStyle(color: Colors.white, fontSize: 12)),
                  ),
                ),
            ]),
            label: 'Notification',
          ),
          const BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          const BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Account'),
        ],
        currentIndex: 1,
        selectedItemColor: Colors.orange,
        unselectedItemColor: Colors.grey,
        onTap: (i) {
          if (i == 0) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (_) => TrackingPage(
                  token: widget.token,
                  parentId: widget.parentId,
                  busId: '680b6b964b3ec354b671fdd3', // hardcoded busId
                  busNo: 'TXXXX',
                  driverName: 'Unknown',
                  driverPhone: '0000000000',
                  // NO destinationLat or destinationLng here!
                ),
              ),
            );
          } else if (i == 2) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (_) => HomePage(token: widget.token, parentId: widget.parentId, busId: '',),
              ),
            );
          } else if (i == 3) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (_) => AccountPage(token: widget.token, parentId: widget.parentId),
              ),
            );
          }
        },
      ),
    );
  }
}
