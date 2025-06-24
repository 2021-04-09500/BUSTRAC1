class Student {
  final String id;
  final String name;
  final String classValue;
  final String time;
  final String location;
  final String busNo;
  final String driverName;
  final String driverPhone;

  Student({
    required this.id,
    required this.name,
    required this.classValue,
    required this.time,
    required this.location,
    required this.busNo,
    required this.driverName,
    required this.driverPhone,
  });

  factory Student.fromJson(Map<String, dynamic> json) {
    return Student(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      classValue: json['classValue'] ?? '',
      time: json['time'] ?? '',
      location: json['location'] ?? '',
      busNo: json['busNo'] ?? '',
      driverName: json['driverName'] ?? '',
      driverPhone: json['driverPhone'] ?? '',
    );
  }
}
