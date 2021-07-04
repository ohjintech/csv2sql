CREATE TABLE sampleTable (
"id" serial NOT NULL,
"Company_Name" VARCHAR,
"Name" VARCHAR,
"Email" VARCHAR,
"LinkedIn" VARCHAR,
"Campus" VARCHAR,
"Cohort" VARCHAR,
"Job_Title" VARCHAR,
"Industry" VARCHAR,
"City" VARCHAR,
PRIMARY KEY (id)
);

COPY sampleTable(Company_Name,Name,Email,LinkedIn,Campus,Cohort,Job_Title,Industry,City)
  FROM '../assets/AlumniDirectory.csv'
  DELIMITER ','
  CSV HEADER;
  