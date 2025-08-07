let button =document.getElementById("guardar");

button.addEventListener("click",guardardatos)

async function guardardatos() {
        let nombre = document.getElementById("nombre").value;
        let artista = document.getElementById("artista").value;
        let url = document.getElementById("url").value;
        let body = JSON.stringify({nombre,artista,url_video:url});
        try{
    
            let response = await fetch('http://localhost:3000/canciones',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: body,
            });
            if(response.status==201){
                let cancion = await response.body.JSON();
                console.log(cancion);
                addSongToList(cancion.nombre, cancion.artista, cancion.votos, cancion.url_video);
            }
        } catch(error){
            console.error(error);
        }
        alert("BODY:"+body+"")
};

document.getElementById('randomSong').addEventListener('click', () => {
    fetch('http://localhost:3000/canciones/random')
        .then(response => response.json())
        .then(data => {
            const songInfo = `
                <p><strong>Nombre:</strong> ${data.nombre}</p>
                <p><strong>Artista:</strong> ${data.artista}</p>
                <p><a href="${data.url_video}">Miralo en YouTube</a></p>
            `;
            document.getElementById('randomSongInfo').innerHTML = songInfo;
        });
});

function voteForSong(nombre) {
    fetch('http://localhost:3000/canciones/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songName: nombre })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al votar por la canción');
        }
        return response.json();
    })
    .then(data => {
        alert(`Votaste por: ${nombre}`);
        fetchSongList(); 
    })
    .catch(error => {
        console.error('Error al votar por la canción:', error);
    });
}


function addSongToList(nombre, artista, votos, url_video) {
    const songList = document.getElementById('songList');
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <strong>${nombre}</strong> - ${artista} | Votos: <span class="votos">${votos}</span> 
        <a href="${url_video}" target="_blank">YouTube</a>
        <button onclick="voteForSong('${nombre}')">Votar</button>
    `;
    songList.appendChild(listItem);
}




function fetchSongList() {
    fetch('http://localhost:3000/canciones/list')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener la lista de canciones');
            }
            return response.json();
        })
        .then(songs => {
            const songList = document.getElementById('songList');
            songList.innerHTML = '';
            songs.forEach(song => {
                addSongToList(song.nombre, song.artista, song.votos, song.url_video);
            });
        })
        .catch(error => {
            console.error('Error al obtener la lista de canciones:', error);
        });
}



document.getElementById('getSongListButton').addEventListener('click', fetchSongList);