
function Mixer(id){
    this.mikrofone = [];
    this.id = id;

    this.createMikrofon = () => {
        console.log(this.id);
    }
}

function Preset(name, jwt, id){
    this.name = name;
    this.id = id;
    this.jwt = jwt;

    this.conf = {};
}
