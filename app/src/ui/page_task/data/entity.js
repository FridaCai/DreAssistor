import Signal from '../../../signal.js';

module.exports = class Entity {
    constructor(){
        this.signal_field_change = new Signal();
    }

    defineField(name, fieldChangedCallback){
        Object.defineProperty(this, name, {
            writeable: true,
            enumerable: true,
            configurable: false,
            get: function() { return this['__' + name]; },
            set: function(value) {
                var old = this['__' + name];
                this['__' + name] = value;
                if (this._fieldChangedCallback[name]) {
                    this._fieldChangedCallback[name](this, name, old, value);
                }
            }
        });
        this._fieldChangedCallback = this._fieldChangedCallback || {};
        this._fieldChangedCallback[name] = fieldChangedCallback || this.defaultFieldChangedCallback;
    }

    defaultFieldChangedCallback(entity, field, oldValue, newValue){
        entity.signal_field_change.dispatch({field: field, oldValue: oldValue, newValue: newValue});
    }
}

