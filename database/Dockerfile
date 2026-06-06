FROM mcr.microsoft.com/mssql/server:2022-latest

# Instalar herramientas de SQL
RUN apt-get update && apt-get install -y dos2unix

# Copiar scripts SQL
COPY database/script.sql /app/script.sql
COPY database/indexes.sql /app/indexes.sql
COPY database/procedures.sql /app/procedures.sql
COPY database/inserts.sql /app/inserts.sql

# Convertir CRLF a LF en los scripts
RUN dos2unix /app/script.sql && \
    dos2unix /app/indexes.sql && \
    dos2unix /app/procedures.sql && \
    dos2unix /app/inserts.sql

# Copiar script de inicialización
COPY database/init.sh /app/init.sh
RUN dos2unix /app/init.sh && chmod +x /app/init.sh

# Exponemos puerto
EXPOSE 1433

# Ejecutar SQL Server en background y luego ejecutar init.sh
CMD /bin/bash -c "/opt/mssql/bin/sqlservr & sleep 30 && /app/init.sh & wait"
