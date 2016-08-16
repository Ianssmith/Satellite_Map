#$2 name
#$40 semiminorA
#$45 sec_per_long
#$37 semimajorA
#$14 eccentricity
#$41 meanmotion
BEGIN{FS=OFS=","}

  {print $2, $45, $40, $41, $37, $14} 
