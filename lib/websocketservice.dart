import 'dart:convert';
import 'package:stomp_dart_client/stomp.dart';
import 'package:stomp_dart_client/stomp_config.dart';
import 'package:stomp_dart_client/stomp_frame.dart';

class WebSocketService {
  StompClient? _client;

  void connect({
    required String token,
    required Function(Map<String, dynamic>) onMessage,
    Function()? onConnect,
    Function(dynamic error)? onError,
  }) {
    _client = StompClient(
      config: StompConfig.SockJS(
        url: 'http://192.168.100.3:8081/ws',
        onConnect: (StompFrame frame) {
          print('✅ Connected to STOMP WebSocket');

          // Subscribe to parent notifications (e.g., from Admin)
          _client!.subscribe(
            destination: '/topic/admin',
            callback: (StompFrame frame) {
              if (frame.body != null) {
                try {
                  final Map<String, dynamic> msg = jsonDecode(frame.body!);
                  if (msg['type'] == 'BROADCAST') {
                    onMessage(msg);
                  }
                } catch (e) {
                  print('Error parsing STOMP message: $e');
                }
              }
            },
          );

          if (onConnect != null) onConnect();
        },
        onWebSocketError: (dynamic error) {
          print('❌ WebSocket error: $error');
          if (onError != null) onError(error);
        },
        stompConnectHeaders: {
          'Authorization': 'Bearer $token',
        },
      ),
    );

    _client!.activate();
  }

  void sendMessage(String destination, Map<String, dynamic> message) {
    if (_client != null && _client!.connected) {
      _client!.send(
        destination: destination,
        body: jsonEncode(message),
      );
    }
  }

  void disconnect() {
    _client?.deactivate();
    _client = null;
  }

  bool get isConnected => _client?.connected ?? false;
}
