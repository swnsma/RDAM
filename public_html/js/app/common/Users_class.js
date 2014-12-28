/**
 * Created by Таня on 28.12.2014.
 */
function Users(name,id,active,color){
    this.name=ko.observable(name);
    this.id=ko.observable(id);
    this.active=ko.observable(active);
    this.color=color;
}
