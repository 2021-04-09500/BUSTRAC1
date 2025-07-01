import 'package:stomp_dart_client/stomp.dart';
import 'package:stomp_dart_client/stomp_config.dart';
import 'package:stomp_dart_client/stomp_frame.dart';
import 'dart:convert';

typedef MessageCallback = void Function(Map<String, dynamic> message);

class StompWebSocketService {
  StompClient? _client;

  void connect({
    required String token,
    required MessageCallback onMessage,
  }) {
    _client = StompClient(
      config: StompConfig.SockJS(
        url: 'http://192.168.100.9:8081/ws',  // Your backend WS endpoint
        onConnect: (StompFrame frame) {
          print('✅ STOMP connected');
          _client?.subscribe(
            destination: '/topic/admin',  // Match backend topic, plural "parents"
            callback: (frame) {
              if (frame.body != null) {
                final data = jsonDecode(frame.body!);
                onMessage(data);
              }
            },
          );
        },
        beforeConnect: () async {
          print('Connecting to STOMP...');
          await Future.delayed(const Duration(milliseconds: 200));
        },
        onWebSocketError: (error) {
          print('❌ WebSocket error: $error');
        },
        onStompError: (frame) {
          print('❗ STOMP error: ${frame.body}');
        },
        stompConnectHeaders: {
          'Authorization': 'Bearer $token',
        },
        webSocketConnectHeaders: {
          'Authorization': 'Bearer $token',
        },
        onDisconnect: (frame) {
          print('🔌 Disconnected');
        },
      ),
    );

    _client?.activate();
  }

  void disconnect() {
    _client?.deactivate();
  }
}
