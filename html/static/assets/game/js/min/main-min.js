var pieColors=["#d41442","#efde57","#37ae67","#a5d9ea","#3788b8"],pieOptions={animation:!1,animationSteps:60,animationEasing:"easeOutQuart",showScale:!1,scaleOverride:!1,scaleSteps:null,scaleStepWidth:null,scaleStartValue:null,scaleLineColor:"rgba(0,0,0,.1)",scaleLineWidth:1,scaleShowLabels:!1,scaleLabel:"<%=value%>",scaleIntegersOnly:!0,scaleBeginAtZero:!1,scaleFontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",scaleFontSize:12,scaleFontStyle:"normal",scaleFontColor:"#666",responsive:!1,maintainAspectRatio:!0,showTooltips:!1,tooltipEvents:["mousemove","touchstart","touchmove"],tooltipFillColor:"rgba(0,0,0,0.8)",tooltipFontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",tooltipFontSize:14,tooltipFontStyle:"normal",tooltipFontColor:"#fff",tooltipTitleFontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",tooltipTitleFontSize:14,tooltipTitleFontStyle:"bold",tooltipTitleFontColor:"#fff",tooltipYPadding:6,tooltipXPadding:6,tooltipCaretSize:8,tooltipCornerRadius:6,tooltipXOffset:10,tooltipTemplate:"<%if (label){%><%=label%>: <%}%><%= value %>",multiTooltipTemplate:"<%= value %>",segmentShowStroke:!1,segmentStrokeColor:"#fff",segmentStrokeWidth:0,animationSteps:100,animationEasing:"easeOutBounce",animateRotate:!1,animateScale:!1},pieData=[],html="",highest={value:0,label:""};window.onload=function(){var e=poll.answers.release_versions,t=0,l,o;for(var a in e)o=parseInt(a),o>t&&(t=o,l=e[a]);console.log("LOADING RELEASE:",t);var i=0;for(var a in l){var n=l[a];for(var s in n)n.hasOwnProperty(s)&&(n[s]>highest.value&&(highest={value:n[s],label:s}),pieData.push({value:n[s],color:pieColors[i]}),html+="<li class='key-answer-"+i+"'>"+s+"</li>",i++,i>pieColors.length&&(i=0))}var r=document.getElementById("chart").getContext("2d"),p=new Chart(r).Pie(pieData,pieOptions);$("#key-answers").html(html),$("#highest-result").append(" "+highest.label+".")};