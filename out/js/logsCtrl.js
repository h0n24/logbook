app.controller('logsCtrl', function ($scope) {
    $scope.select = {
        value1: 'Ничего не выбрано',
        choices: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    };
    $scope.th_packets_colums = [
        {th: 'Название метод-пакета'},
        {th: 'Форма'},
        {th: 'Город'},
        {th: 'ФИО преподавателя'},
        {th: 'e-mail'},
        {th: 'тел.'},
        {th: 'Действие'},
        {th: 'Дата'}
    ];


    $scope.th_materials_colums = [
        {th: 'Название метод-материала'},
        {th: 'Форма'},
        {th: 'Материал'},
        {th: 'Город'},
        {th: 'ФИО преподавателя'},
        {th: 'e-mail'},
        {th: 'тел.'},
        {th: 'Действие'},
        {th: 'Дата'}
    ];
    $scope.tr_materials_colums = [
        {name: 'Коммутация в локальных сетях, профессиональный (ПС) - [ ПС ]', form: 'ПС', material: 'Книги', city: 'Одесса', teacher: 'Волкобой Владислав', mail: 'volkoboy_v@itstep.org', phone: '0508749850', action: 'изменение', date: '2016-08-09 13:37'},
        {name: 'Программирование на Python', form: 'Корпоративные курсы', material: 'Презентации', city: 'Днепр', teacher: 'Шаптала Максим Валентинович', mail: 'shaptala@itstep.org', phone: '0508749850', action: 'добавление', date: '2016-08-04 17:47'}
    ];
});