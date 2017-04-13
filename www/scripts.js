var todo = {
    filterFlag: 'all',
    events: []
};

document.addEventListener('init', function(event){
    var view = event.target.id;
    
    if(view === 'menu' || view === 'list'){
        todo[view + 'Init'](event.target);
    }
},false);

todo.listInit = function(target){
    this.list = document.querySelector('#todo-list');
    
    target.querySelector('#splitter-toggle').addEventListener('click', function(){
        document.querySelector('#splitter-menu').open();
    });
    
    target.querySelector('#add').addEventListener('click', this.addItemPrompt.bind(this));
    
    todoStorage.init();
    this.refresh();
};

todo.addItemPrompt = function() {
    ons.notification.prompt('Insert new Bucket item.', {
        title : 'New Bucket',
        cancelable : true,
        
        callback : function(label) {
            if(label === '' || label === null) {
                return;
            }
            
            if(todoStorage.add(label)){
                this.refresh();
            } else {
                ons.notification.alert('Failed to add Bucket to the Bucket list!');
            }
        }.bind(this)
    });
};

todo.refresh = function(){
    var items = todoStorage.filter(this.filterFlag);
    
    this.list.innerHTML = items.map(function(item){
        return document.querySelector('#todo-list-item').innerHTML
            .replace('{{label}}', item.label)
            .replace('{{checked}}', item.status === 'completed' ? 'checked' : '');
    }).join('');
    
    var children = this.list.children;
    
    this.events.forEach(function(event, i){
        event.element.removeEventListener('click', event.function);
    });
    
    this.events = [];
    
    var event = {};
    items.forEach(function(item, i){
        event = {
            element: children[i].querySelector('ons-input'),
            function: this.toggleStatus.bind(this, item.label)
        };
        this.events.push(event);
        event.element.addEventListener('click', event.function);
        
        event = {
            element: children[i].querySelector('ons-icon'),
            function: this.removeItemPrompt.bind(this, item.label)
        };
        this.event.push(event);
        event.element.addEventListener('click', event.function);
    }.bind(todo));
};

todo.toggleStatus = function(label) {
    if(todoStorage.toggleStatus(label)) {
        this.refresh();
    } else {
        ons.notification.alert('Failed to change the status of the selected Bucket!');
    }
}

todo.removeItemPrompt = function(label) {
    ons.notification.confirm('Are you sure you would like to remove ' + label + ' from the Bucket list?', {
        title: 'Remove Bucket?',
        
        callback: function(answer) {
            if(answer === 1) {
                if(todoStorage.remove(label)) {
                    this.refresh();
                } else {
                    ons.notification.alert('Failed to remove Bucket from Bucket list!');
                }
            }
        }.bind(this)
    });
};

todo.menuInit = function(target) {
    target.querySelector('ons-list').addEventListener('click', this.filter.bind(this));
};

todo.filter = function(evt) {
    this.filterFlag = evt.target.parentElement.getAttribute('data-filter') || 'all';
    this.refresh();
};