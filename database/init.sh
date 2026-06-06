set -e

sleep 30s

echo "initializing db"
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P root -i /app/script.sql

echo "inserts.."
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P root -i /app/inserts.sql

echo "procedures.."
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P root -i /app/procedures.sql

echo "indexes"
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P root -i /app/indexes.sql