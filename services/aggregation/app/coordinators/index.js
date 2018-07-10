const cm = require('./cmatrix');

module.exports = {
    //POST
    CreateKn    : function(data, callback) { return cm.CreateKn(data, callback); },
    CreateWork  : function(data, callback) { return cm.CreateWork(data, callback);},
    CreateHMark : function(data, callback) { return cm.CreateHMark(data, callback); },
    //GET
    GetKns      : function(page, count, callback) { return cm.GetKns(page, count, callback); },
    GetKnById   : function(id, callback) { return cm.GetKnById(id, callback); },
    GetWorks    : function(page, count, callback) { return cm.GetWorks(page, count, callback); },
    GetWorkById : function(id, callback) { return cm.GetWorkById(id, callback); },
    GetHMarks   : function(page, count, callback) { return cm.GetHMarks(page, count, callback); },
    GetHMarkById: function(id , callback) { return cm.GetHMarkById(id, callback); },
    // PUT
    UpdateKn    : function(id, data, callback) { return cm.UpdateKn(id, data, callback); },
    UpdateWork  : function(id, data, callback) { return cm.UpdateWork(id, data, callback); },
    UpdateHMark : function(id, data, callback) { return cm.UpdateHMark(id, data, callback); },
    // DELETE
    DeleteKns      : function(callback) { return cm.DeleteKns(callback); },
    DeleteKnById   : function(id, callback) { return cm.DeleteKnById(id, callback); },
    DeleteWorks    : function(callback) { return cm.DeleteWorks(callback); },
    DeleteWorkById : function(id, callback) { return cm.DeleteWorkById(id, callback); },
    DeleteHMarks   : function(callback) { return cm.DeleteHMarks(callback); },
    DeleteHMarkById: function(id, callback) { return cm.DeleteHMarkById(id, callback); }
}