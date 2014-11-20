/**
 * Created by Таня on 20.11.2014.
 */
function Users(name,id,active){
    this.name=ko.observable(name);
    this.id=ko.observable(id);
    this.active=ko.observable(active);
    this.name_table=ko.observable('user_'+id);
}
