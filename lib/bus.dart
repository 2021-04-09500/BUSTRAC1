import 'dart:convert';
import 'package:http/http.dart' as http;

class BusService {
  static const String baseUrl = "http://192.168.0.11:8081"; // Adjust if needed

  static Future<Map<String, String>> getBusDetailsByStudentId(String studentId) async {
    final url = '$baseUrl/buses/student/$studentId';

    try {
      final response = await http.get(Uri.parse(url));
      print("GET $url → Status: ${response.statusCode}");
      print("Body: ${response.body}");

      if (response.statusCode == 200 || response.statusCode == 404) {
        final body = jsonDecode(response.body);

        return {
          "plateNumber": body["plateNumber"] ?? "Not yet assigned",
          "driverName": body["driverName"] ?? "Unknown",
          "driverPhone": body["driverPhone"] ?? "Not available",
        };
      } else {
        throw Exception('Unexpected response code: ${response.statusCode}');
      }
    } catch (e) {
      print("Exception in getBusDetailsByStudentId: $e");

      // Fallback if JSON decoding fails or server returns HTML
      return {
        "plateNumber": "Not yet assigned",
        "driverName": "Unknown",
        "driverPhone": "Not available",
      };
    }
  }
}
