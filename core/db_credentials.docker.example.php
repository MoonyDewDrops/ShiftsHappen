<?php
// Copy this to core/db_credentials.php when running via Docker.
// (core/db_credentials.php is gitignored, so your partner's XAMPP
// version — host 'localhost' — is untouched by this.)
$dbhost = 'shiftshappen';        // matches the "db" service name in docker-compose.yml
$dbusername = 'root';
$dbpassword = 'rootpass'; // matches MYSQL_ROOT_PASSWORD in docker-compose.yml
$dbname = 'shiftshappen';