BEGIN{FS=",";OFS=", "}
#create inverse Trig functions
#sin^2(x)+cos^2(x) = 1
#=>cos(x) = sqrt(1-sin^2(x))
#sin(thet)=cos(thet)*tan(thet)
#sin(thet)=sqrt(1-sin^2(thet))*tan(thet)
#=>sin(thet)/sqrt(1-sin^2(thet)) = tan(thet)
#
#sin(thet) = x == asin(x) = thet
#tan(thet) = x == atan(x) = thet
#
#=>thet = atan(sin(thet)/sqrt(1-sin^2(thet)))
#
#thet = atan(x/sqrt(1-x^2))

function asin(x){return atan2(x,sqrt(1-x^2))}
function acos(x){return atan2(sqrt(1-x^2),x)}
  #{print $2, $45, $40, $41, $37, $14} 
  #gsub(/ ,/,",")
{i=7
while(NF<=366){
	$i = i-7					#create degrees
	$i *= $2					#time till X position
	$i *= $4					#mean anomaly
	$i = $i-($i - $6*sin($i)-$i)/1-$6*cos($i)	#eccentric anomaly
	$i = acos(cos($i)-$6/1-$6*cos($i))		#true anomaly
	$i *= 2						#adjusting true anomaly
	$i = "[" cos($i)*$5 "|" sin($i)*$3 "]"		#convert to cartesian[x|y]
	i++
	}
#{print}
}
NR==1{j=7
	while(NF<=367){
		$j = j-7
		j++
	}
}
NR==1 {sub(/, 361/,"")}
{gsub(/\|/,",")}
{print}
