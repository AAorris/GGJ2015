Network = function() {
    this.server= false;
    this.ready = false;
    this.client= false;
    this.setup = function(finished) {
        this.client = new Eureca.Client();
        client.ready = function(proxy) {
            this.server = proxy;
            Debug.log("Got proxy");
            finished();
        }
        this.client.exports.connect = function(id) {
            Debug.log("Got id : " + id);
            this.server.handshake();
            this.ready = true;
        }
        this.client.exports.update = function(id, state) {
            Debug.log("Updating id: "+id);
        }
    }
}