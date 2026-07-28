function sendOTP() {
    let phone = document.getElementById("phone").value;

if (phone.length === 10) {
                alert("OTP sent to " + phone);
                document.getElementById("otpSection").style.display = "block";
            } else {
                alert("Enter a valid phone number");
            }
        }

        function verifyOTP() {
            let otp = document.getElementById("otp").value;
            if (otp === "1234") {
                document.getElementById("loginContainer").style.display = "none";
                document.getElementById("homeContainer").style.display = "block";
            } else {
                alert("Invalid OTP. Try again.");
            }
        }

        function showAptitudeTest() {
            document.getElementById("homeContainer").style.display = "none";
            document.getElementById("aptitudeTestContainer").style.display = "block";
        }

        function evaluateAptitude(event) {
            event.preventDefault();
            let scores = { Engineering: 0, Medical: 0, Arts: 0 };
            for (let i = 1; i <= 4; i++) {
                scores[document.getElementById("q" + i).value]++;
            }
            let bestCareer = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
            document.getElementById("careerRecommendation").innerHTML = "Recommended Career: " + bestCareer;
        }

        function showCollegeForm() {
            document.getElementById("homeContainer").style.display = "none";
            document.getElementById("collegeFormContainer").style.display = "block";
        }

        function getRecommendations(event) {
            event.preventDefault();
            const interest = document.getElementById("interest").value;
            const course = document.getElementById("course").value;
            const recommendationsDiv = document.getElementById("recommendations");
            let recommendations = `<h3>Recommended Colleges:</h3>`;
            recommendations += `<p>Colleges offering ${course} in ${interest} field</p>`;
            recommendationsDiv.innerHTML = recommendations;
      }