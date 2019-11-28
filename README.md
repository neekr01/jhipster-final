    
Sonar-Server setup and integration with jekins pipeline (we have used a seperate instance for sonarqube)

###1. Perform a system update
```
   - sudo apt-get update
   - sudo apt-get -y upgrade
 ```

2. Install jdk
   - sudo apt-get install default-jdk


3. Install and configure PostgreSQL
   - Install the PostgreSQL repository
       - sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
       - wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O - | sudo apt-key add -
   
   - Install the PostgreSQL database server by running
       - sudo apt-get -y install postgresql postgresql-contrib

   - Start PostgreSQL server and enable it to start automatically at boot time by running:
       - sudo systemctl start postgresql
       - sudo systemctl enable postgresql

   - Change the password for the default PostgreSQL user.
       - sudo passwd postgres

   - Switch to the postgres user.
       - su - postgres

   - Create a new user by typing:
       - createuser sonar

   - Switch to the PostgreSQL shell.
       - psql

   - Set a password for the newly created user for SonarQube database.
       - ALTER USER sonar WITH ENCRYPTED password 'P@ssword';

   - Create a new database for PostgreSQL database by running:
       - CREATE DATABASE sonar OWNER sonar;

   - Exit from the psql shell:
       - \q

   - Switch back to the sudo user by running the exit command.
       - exit


4. Download and configure SonarQube
   - Download the SonarQube installer files archive.
       - wget https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-7.3.zip
  
   - Install unzip by running:
       - apt-get -y install unzip

   - Unzip the archive using the following command.
       - sudo unzip sonarqube-7.3.zip -d /opt

   - Rename the directory:
       - sudo mv /opt/sonarqube-7.3 /opt/sonarqube

   - Add a sonar user
       - adduser name_of_user    e.g; adduser sonaradmin

   - Add a password
       - passwd

   - Assign permissions to sonar user(sonaradmin) for directory /opt/sonarqube
       - sudo chown -R sonaradmin:sonaradmin /opt/sonarqube/

   - Open the SonarQube configuration file using any text editor.
       - sudo nano /opt/sonarqube/conf/sonar.properties

   - Find the following lines
         #sonar.jdbc.username=
         #sonar.jdbc.password=

   - Uncomment and provide the PostgreSQL username and password of the database that we have created earlier. It should look like:
         sonar.jdbc.username=sonar
         sonar.jdbc.password=P@ssword

   - Find and uncomment the below line
       - #sonar.jdbc.url=jdbc:postgresql://localhost/sonar

   - Finally, tell SonarQube to run in server mode :
       - sonar.web.javaAdditionalOpts=-server

   - Uncomment these lines
       - sonar.web.host=0.0.0.0     (By default, ports will be used on all IP addresses associated with the server)
       - sonar.web.context=/sonar   (sonar-server will be accessed as http://ip:9000/sonar)
       - sonar.web.port=9000        (deafault value is 9000)

   - save the file and exit from the editor


5. Configure Systemd service
   - SonarQube can be started directly using the startup script provided in the installer package. As a matter of convenience, 
     we will setup a Systemd unit file for SonarQube.

   - open sonar.service file
      - sudo nano /etc/systemd/system/sonar.service

   - Populate the file with:
     /*
      [Unit]
      Description=SonarQube service
      After=syslog.target network.target

      [Service]
      Type=forking

      ExecStart=/opt/sonarqube/bin/linux-x86-64/sonar.sh start
      ExecStop=/opt/sonarqube/bin/linux-x86-64/sonar.sh stop

      User=sonaradmin   (sonar user which we created)
      Group=sonaradmin
      Restart=always

      [Install]
      WantedBy=multi-user.target

     */


    - Start the application by running:
       - sudo systemctl start sonar

    - Enable the SonarQube service to automatically start at boot time.
       - sudo systemctl enable sonar

    - To check if the service is running, run:
       - sudo systemctl status sonar


6. Accessing Sonarqube Server 
    - http://server_domain_name:9000/sonar
    

7. Integrating sonarqube with Jenkins (Assumed Jenkins is up and running)
    - Install sonarqube scanner for jenkins
      - Jenkins -> Manage Jenkins -> Manage Plugins -> Available -> search for SonarQube Scanner for Jenkins and install it

    - Configuring Jenkins to connect with sonar server
      - Jenkins -> Manage Jenkins -> Configure System -> Sonarque servers
         -> Name:       sonarqube-server
         -> Server Url: http://server_domain_name:9000/sonar/projects
         -> Server authentication token:
              -> For server authentication token, login as admin in sonarqube server(user:admin && password:admin) and generate a server-token
                 by clicking on security. Copy that token and save as secret text in your jenkins credentials.

    - Configuring Sonarqube scanner installations:
       - Jenkins -> Manage Jenkins -> Global Tool Configuration -> Sonarqube Scanner  (Install sonarqube in /opt/sonarqube on sonar-instance)
          -> Name: sonar-scanner-4.2.0.1873 -linux (name of sonar scanner u downloaded)
          -> SONAR_RUNNER_HOME: /opt/sonarqube/


8. Sample Sonar Analysis stage in Pipeline
      stage("Sonar Analysis"){
        
               withSonarQubeEnv('sonarqube-server') {
 
                   sh "cd ui && ./mvnw -Pprod clean verify sonar:sonar \
  
               -Dsonar.host.url=http://35.222.169.94:9000/sonar \
 
               -Dsonar.login=ab5974fb6e7d2d6c0ef47e583e950e5679a00a28 && cd .."
  
  
              }

-------------------End----------------------
 

//* There is one more simple way to set up sonarqube using docker but that method is hardly used for production  *//

1. Install Docker
   - curl -fsSL get.docker.com | /bin/bash   

2. Pull sonarqube docker image
   - docker pull sonarqube

3. Run that docker image
   - docker run -d sonarqube -p 9000:9000 sonarqube

4. Accessing Sonarqube Server 
    - http://server_domain_name:9000/
    
------------End-----------


gatling-maven-plugin-demo
=========================

Simple showcase of a maven project using the gatling-maven-plugin.

To test it out, simply execute the following command:

    $mvn gatling:test -Dgatling.simulationClass=computerdatabase.BasicSimulation

or simply:

    $mvn gatling:test
    
    
    
