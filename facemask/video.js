const face = document.getElementById("face");
const nose = document.getElementById("nose");
const leftEye = document.getElementById("leftEye");
const rightEye = document.getElementById("rightEye");
const rightHand = document.getElementById("right-hand");

const video = document.getElementById("video");
video.width = window.innerWidth;
video.height = window.innerHeight;

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    video.srcObject = stream;
    video.play();
    return new Promise(resolve => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });
  });
}

function detectPoseInRealTime(video, net) {
  async function poseDetectionFrame() {
    const pose = await net.estimateSinglePose(video, {
      flipHorizontal: false
    });

    const facePosition = pose.keypoints[0].position;
    face.style.transform =
      "translate(" +
      (facePosition.x - face.offsetWidth / 2) +
      "px," +
      (facePosition.y - face.offsetHeight / 2 - 50) +
      "px)";

    const nosePosition = pose.keypoints[0].position;
    nose.style.transform =
      "translate(" +
      (nosePosition.x - nose.offsetWidth / 2) +
      "px," +
      (nosePosition.y - nose.offsetHeight / 2) +
      "px)";
    
    
    if(nosePosition.x > 400){
      nose.style.color = "red"
    } else {
      nose.style.color = "black"
    }

    const leftEyePosition = pose.keypoints[1].position;
    leftEye.style.transform =
      "translate(" +
      (leftEyePosition.x - leftEye.offsetWidth / 2) +
      "px," +
      (leftEyePosition.y - leftEye.offsetHeight / 2) +
      "px)";

    const rightEyePosition = pose.keypoints[2].position;
    rightEye.style.transform =
      "translate(" +
      (rightEyePosition.x - rightEye.offsetWidth / 2) +
      "px," +
      (rightEyePosition.y - rightEye.offsetHeight / 2) +
      "px)";

    const rightHandPosition = pose.keypoints[10].position;
    rightHand.style.transform =
      "translate(" +
      (rightHandPosition.x - rightHand.offsetWidth / 2) +
      "px," +
      (rightHandPosition.y - rightHand.offsetHeight / 2) +
      "px)";

    requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame();
}

async function load() {
  const net = await posenet.load();
  detectPoseInRealTime(video, net);
}

video.onloadeddata = event => {
  load();
};
