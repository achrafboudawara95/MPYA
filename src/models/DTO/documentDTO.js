class DocumentDTO {

    constructor(data){
        this.identifier = data.identifier
        this.nbVersions = data.nbVersions
        this.nbViews = data.nbViews
        this.nbSaves = data.nbSaves
        this.nbDownloads = data.nbDownloads 
        this.disabledAt = data.disabledAt
        this._id = data._id
        this.name = data.name
        this.keywords = data.keywords
        this.events = data.events
        this.user = data.user
        this.createdAt = data.createdAt
        this.updatedAt = data.updatedAt
        this.saved = data.saved
        this.address = data.address
    }

    setIdentifier = function(identifier) { this.identifier = identifier; } 
    getIdentifier = function() { return this.identifier; } 
    setNbVersions = function(nbVersions) { this.nbVersions = nbVersions; } 
    getNbVersions = function() { return this.nbVersions; } 
    setNbViews = function(nbViews) { this.nbViews = nbViews; } 
    getNbViews = function() { return this.nbViews; } 
    setNbSaves = function(nbSaves) { this.nbSaves = nbSaves; } 
    getNbSaves = function() { return this.nbSaves; } 
    setNbDownloads = function(nbDownloads) { this.nbDownloads = nbDownloads; } 
    getNbDownloads = function() { return this.nbDownloads; } 
    setDisabledAt = function(disabledAt) { this.disabledAt = disabledAt; } 
    getDisabledAt = function() { return this.disabledAt; } 
    set_id = function(_id) { this._id = _id; } 
    get_id = function() { return this._id; } 
    setName = function(name) { this.name = name; } 
    getName = function() { return this.name; } 
    setKeywords = function(keywords) { this.keywords = keywords; } 
    getKeywords = function() { return this.keywords; } 
    setEvents = function(events) { this.events = events; } 
    getEvents = function() { return this.events; } 
    setUser = function(user) { this.user = user; } 
    getUser = function() { return this.user; } 
    setCreatedAt = function(createdAt) { this.createdAt = createdAt; } 
    getCreatedAt = function() { return this.createdAt; } 
    setUpdatedAt = function(updatedAt) { this.updatedAt = updatedAt; } 
    getUpdatedAt = function() { return this.updatedAt; } 
    setSaved = function(saved) { this.saved = saved; } 
    getSaved = function() { return this.saved; }
    setAddress = function(address) { this.address = address; } 
    getAddress = function() { return this.address; }

    toJSON = function () {
        return {
            identifier : this.identifier,
            address: this.address,
            nbVersions : this.nbVersions,
            nbViews : this.nbViews,
            nbSaves : this.nbSaves,
            nbDownloads : this.nbDownloads,
            disabledAt : this.disabledAt,
            _id : this._id,
            name : this.name,
            keywords : this.keywords,
            events : this.events,
            user : this.user,
            createdAt : this.createdAt,
            updatedAt : this.updatedAt,
            saved : this.saved
        }
    }
}

module.exports = DocumentDTO