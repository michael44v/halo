<?php
// api/Database.php - OOP mysqli implementation

class Database {
    private $host = "127.0.0.1";
    private $db_name = "halo_db";
    private $username = "halo_user";
    private $password = "halo_pass_123";
    private $conn = null;

    public function getConnection() {
        if ($this->conn === null) {
            // Object-oriented mysqli connection
            $this->conn = new mysqli($this->host, $this->username, $this->password, $this->db_name);

            if ($this->conn->connect_error) {
                // Fallback attempt with root if default permissions vary
                $this->conn = new mysqli($this->host, "root", "", $this->db_name);
                if ($this->conn->connect_error) {
                    http_response_code(500);
                    echo json_encode([
                        "status" => "error",
                        "message" => "Database connection failed: " . $this->conn->connect_error
                    ]);
                    exit;
                }
            }

            $this->conn->set_charset("utf8mb4");
        }

        return $this->conn;
    }
}
