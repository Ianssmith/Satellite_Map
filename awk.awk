BEGIN{FS=OFS=","}#;OFS=", "}
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
{i=56
while(NF<=415){
	$i = i-56					#create degrees
	$i *= $45	#$2					#time till X position
	$i *= $41	#$4					#mean anomaly
	$i = $i-($i - $14*sin($i)-$i)/1-$14*cos($i)  #6	#eccentric anomaly
	$i = acos(cos($i)-$14/1-$14*cos($i))		#true anomaly
	$i *= 2						#adjusting true anomaly
	$i = "[" cos($i)*$37 "|" sin($i)*$40 "]"		#convert to cartesian[x|y]
	i++
	}
#{print}
}
NR==1{j=56
	while(NF<=416){#367
		$j = "deg" j-56
		j++
	}
}
NR==1 {$1 = "index"};{sub(/,361/,"")}
{gsub(/\|/,",")}
{print}
