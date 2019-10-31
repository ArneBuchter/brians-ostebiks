document.addEventListener("DOMContentLoaded", function() {

    const params = new URLSearchParams(window.location.search);
    const skuId = params.get('sku');
    const db = firebase.firestore();
    let docRef = db.collection("wine").doc(skuId);
    const template = document.querySelector('#template');
    const list = document.querySelector('.gallery');
    const container = document.getElementsByClassName("page")[0];

    docRef.get().then(function(doc) {
        console.log(doc.data().name)
        container.querySelector("h1").innerText = doc.data().name;
        container.querySelector(".gallery__large").src = `/assets/images/${doc.data().image[0]}`;
        container.querySelector(".price").innerText = doc.data().price;
        container.querySelector(".region").innerText = doc.data().region;
        container.querySelector(".country").innerText = doc.data().country;
                
        doc.data().image.forEach(billede => {
            const clone = template.content.cloneNode(true);
            
            clone.querySelector(".gallery__small").src = `/assets/images/${billede}`;

            list.appendChild(clone);
        });

        container.querySelectorAll(".gallery__small").forEach(function(img) {
            img.addEventListener("click", function() {
                container.querySelector(".gallery__large").src = this.src;
            })
        }) 
    })
    document.querySelector('.starlist').addEventListener('click', function(e){
        const stars = parseInt(e.target.dataset.rating);

        docRef.collection("ratings")
        .doc("rating")
        .update({
            usersRated: firebase.firestore.FieldValue.increment(1),
            totalStars: firebase.firestore.FieldValue.increment(stars)
        })
    })

    docRef.collection('ratings').doc("rating").get().then(function(doc) {
        const usersRated = doc.data().usersRated;
        const totalStars = doc.data().totalStars;
        const average = totalStars / usersRated;

        container.querySelector('.placeholder').innerText = average.toFixed(1);
        container.querySelector('.placenumber').innerText = usersRated;
    })
});