let selectedPhotos = [
  "./images/lat_.jpg",
  "./images/LAT1.jpg",
  "./images/LAT2.jpg",
  "./images/LAT3.jpg",
  "./images/tradImg.jpg",
  "./images/whiteWedding.jpg",
  "./images/trad_img.jpg",
  "images/backgroundImage.jpg",
];

let i = -1;
let time = 3000;

// function changeImage() {
//   let imageSlide = document.getElementById("image-slide");
//   if (i < selectedPhotos.length - 1) {
//     i++;
//   } else {
//     i = 0;
//   }
//   //   document.slide.src = selectedPhotos[i];
//   imageSlide.style.backgroundImage = `url(${selectedPhotos[i]})`;
//   console.log(imageSlide);

//   setTimeout("changeImage()", time);
// }
// window.onload = changeImage;
function changeImage() {
  if (i < selectedPhotos.length - 1) {
    i++;
  } else {
    i = 0;
  }

  document.slide.src = selectedPhotos[i];
  setTimeout("changeImage()", time);
}

window.onload = changeImage;
