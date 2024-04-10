var app_module = angular.module('app');

app_module.controller('presentsCtrl', ['$scope', 'presentsHttp', '$rootScope', '$timeout', 'localStorageService', '$q', '$filter', '$mdToast', '$mdDialog', 'WAS_TRUE', 'WAS_FALSE', presentsCtrl])

function presentsCtrl($scope, presentsHttp, $rootScope, $timeout, localStorageService, $q, $filter, $mdToast, $mdDialog, WAS_TRUE, WAS_FALSE) {
	$rootScope.getApprovedRequest();

	$scope.cur_group = localStorageService.get('cur_group_pr');
	$scope.cur_lenta = localStorageService.get('cur_lenta_pr');
	$scope.cur_schedule  = localStorageService.get('cur_schedule_pr');
	$scope.cur_date = localStorageService.get('cur_date_pr');
	$scope.cur_spec = localStorageService.get('cur_spec_pr');

	$scope.can_set_th = false;

	// Объект, для сохранения данных о начисленных кристаллах студентам, перед отправкой на сервер
	$scope.prizeStud = {};

	// Объект, для сохранения данных о посещении студентами пары, перед отправкой на сервер
	$scope.wasStud = {};

	// Объект, для сохранения данных об оценках студентов, перед отправкой на сервер
	$scope.markStud = {};

	$rootScope.wasUsers = [];
	// #KAN-1504 remove this item
	// $scope.userWasSave = true;
	$scope.userState = '';
	$scope.not_student = false;
	$scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
		'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
		'WY').split(' ').map(function (state) {
		return {abbrev: state};
	});
	$scope.total = {diamondsCount: 0};

	// Тип оценки - за контрольную работу.
	$scope.TYPE_MARK_TEST_WORK = 2;
	// Тип оценки - за классную работу.
	$scope.TYPE_MARK_CLASSWORK = 4;

	// Для отображения popup об успешном удалении алмазов
	$scope.REMOVE_REWARD = 4;

	$scope.isAllOnline = false;
	// Тип присутствия на занятии
	$scope.WASTYPE = {
		OFFLINE: 1,
		ONLINE: 2,
	}

	$scope.currentTab = null;

	$scope.disabledForm = false;
	$scope.isEssayType = false;

	/**
	 * Загрузка расписания со студентами.
	 * @param data - данные.
	 * @param headers - заголовки для запроса на получение студентов расписания.
	 */
	$scope.getPresents = function (data, headers) {
		data.date = $scope.cur_date;
		presentsHttp.getPresents(data, headers).success(function (r) {
			$scope.th_presents_colums = [
				{th: $filter('translate')('stud_photo')},
				{th: $filter('translate')('fio_stud')},
				{th: $filter('translate')('vizit_mystat')},
				{th: ''},
				{th: '  '},
				{th: $filter('translate')('control_work')},
				{th: $filter('translate')('work_in_lessons')},
				{th: ' '},
				{th: $filter('translate')('comment')},
			];
			if (r) {
				$scope.disableForm(r);
				$scope.cur_lenta = r.cur_lenta || r.cur_lenta == '0' ? r.cur_lenta : 0;
				$scope.currentTab = $scope.getLessonTime($scope.cur_lenta.l_start, $scope.cur_lenta.l_end);
				$scope.groups = r.groups;
				$scope.students = r.students;
				$scope.vizit_info = !angular.isUndefined(r.students) ? $scope.students[0] : {};
				$scope.not_student = false;
				angular.forEach(r.students, function (value) {
					if (value.id_vizit > 0) {
						$scope.vizit_info = value;
					}
				});

				if (angular.isDefined($scope.vizit_info)) {
					$scope.vizit_info.setting_theme = $scope.vizit_info.theme;
				} else {
					$scope.not_student = true;
				}
				$scope.cur_date = r.cur_date;
				$scope.cur_group = r.cur_group;
				$scope.schedule = $scope.mapLessons(r.schedule);
				$scope.cur_spec = r.cur_spec;
				$scope.prev_lenta = r.prev_lenta;
				$scope.cur_schedule = r.cur_schedule;
				$scope.groupCount = !angular.isUndefined($scope.groups) ? Object.keys($scope.groups).length : 0;
				$scope.homework = r.homework;
				$scope.labwork = r.labwork;
				$scope.materials = r.materials;
				$scope.date_hw_overdue = r.date_hw_overdue;
				$scope.next_lenta = !angular.isUndefined(r.next_lenta) ? r.next_lenta : r.cur_lenta;
				$scope.total.diamondsCount = r.totalPoints;
				$scope.today = r.today;
				$scope.cur_lenta_number = r.cur_lenta_number;
				$scope.cur_date_tr = r.cur_date_tr.split(', ')[1] + ', ' + r.cur_date_tr.split(', ')[0];
				$scope.stop_lenta = r.stop_lenta;
				$scope.end_lenta_time = r.end_lenta_time;
				$scope.can_set_theme = r.can_set_theme;
				$scope.isEssayType = !!$scope.schedule.find(item => item.id_schedule == $scope.cur_schedule && item.type == 1);
				var theme = angular.isDefined($scope.vizit_info) ? $scope.vizit_info.theme : '';
				localStorageService.set('cur_group_pr', $scope.cur_group);
				localStorageService.set('cur_lenta_pr', $scope.cur_lenta);
				localStorageService.set('cur_schedule_pr', $scope.cur_schedule);
				localStorageService.set('cur_date_pr', $scope.cur_date);
				localStorageService.set('homework_pr', $scope.homework);
				localStorageService.set('labwork_pr', $scope.labwork);
				localStorageService.set('labwork_pr', $scope.materials);
				localStorageService.set('cur_spec_pr', $scope.cur_spec);
				localStorageService.set('theme', theme);
			}
		})
		$scope.check_theme = 0;
	}

	$scope.disableForm = function (lesson) {
		if (lesson && lesson.cur_lenta) {
			const lessonDay = new Date(lesson.cur_date);
			const lessonStart = lesson.cur_lenta.l_start.split(':');
			lessonDay.setHours(lessonStart[0], lessonStart[1]);
			const lessonTimestamp = lessonDay.getTime();

			const todayTimestamp = Date.now();

			// $scope.disabledForm = lessonTimestamp > todayTimestamp;
			// TODO hardcode
			$scope.disabledForm = false;
		}
	}

	$scope.mapLessons = function (schedule) {
		const dateNow = new Date();
		const dateStr = dateNow.toISOString().split('T')[0];

		const timestampNow = new Date(new Date().toISOString().split('T')[0]).valueOf();
		const timestampDate = new Date($scope.cur_date).valueOf();

		const nowHour = dateNow.getHours();
		const nowMin = dateNow.getMinutes();

		return schedule.map(item => {
			const startHour = +item.l_start.split(':')[0];
			const startMin = +item.l_start.split(':')[1];
			item.isLessonStarted =
				(timestampDate < timestampNow) ||
				(startHour < nowHour || startHour === nowHour && startMin <= nowMin);

			item.isDisabled = dateStr === $scope.cur_date && (startHour > nowHour || startHour === nowHour && startMin > nowMin);
			item.lessonTime = $scope.getLessonTime(item.l_start, item.l_end);

			return item;
		})
	}

	$scope.showPrerenderedDialog = function (ev) {
		$mdDialog.show({
			controller: DialogController,
			contentElement: '#myDialog',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: true,
		});
	};

	$scope.getLessonTime = function (start, end) {
		return start && end ?
			`${start.split(':').slice(0,2).join(':')} - ${end.split(':').slice(0,2).join(':')}` :
  		'-:-';
	}

	$scope.hidemyDialog = function () {
		$mdDialog.hide();
	};

	function DialogController($scope, $mdDialog) {
		$scope.hide = function () {
			$mdDialog.hide();
		};

		$scope.cancel = function () {
			$mdDialog.cancel();
		};

		$scope.answer = function (answer) {
			$mdDialog.hide(answer);
		};
	}

	$scope.click_lenta = function (lesson, index) {
		if (lesson.lessonTime === $scope.currentTab) return;
		$scope.currentTab = lesson.lessonTime;
		const data = {
			time_line: {
				l_start: lesson.l_start,
				l_end: lesson.l_end,
			}
		}
		$scope.getPresents(data, null);
	}

	$scope.setTeachType = function (type) {
		if ($scope.disabledForm) return;
		$scope.check_theme = 1;
		$scope.vizit_info.primary_teach = type;
		$scope.vizit_info.old_theme = $scope.vizit_info.theme;
	}

	$scope.showTheme = function () {
		return $scope.check_theme === 1;
	}

	$scope.setTheme = function () {
		var theme = $scope.vizit_info.setting_theme;
		presentsHttp.setTheme({
			date: $scope.cur_date,
			lenta: $scope.cur_lenta,
			group: $scope.cur_group,
			theme: theme,
			spec: $scope.cur_spec.id_spec,
			schedule: $scope.cur_schedule,
			teach_type: $scope.vizit_info.primary_teach,
		}).success(function (r) {
			if (!r.error) {
				$scope.check_theme = 0;
				$scope.vizit_info.theme = $scope.vizit_info.setting_theme;
				localStorageService.set('theme', $scope.vizit_info.theme);
				if (angular.isDefined(r.visits_id)) {
					$scope.students = $scope.students.map(function (val) {
						val['was'] = WAS_FALSE;
						angular.forEach(r.visits_id, function (valueResponse, keyResponse) {
							if (valueResponse.id_stud == val.id_stud) {
								val['id_vizit'] = valueResponse.id_vizit;
							}
						});

						return val;
					});
				}
				angular.element('.lesson-theme').val();
			} else {
				$mdToast.show({
					hideDelay: 3000,
					position: 'top right',
					template: '<md-toast class="md-toast red">' + r.error + '</md-toast>',
				});
			}
		})
			.error(function (error) {
				$mdToast.show({
					hideDelay: 3000,
					position: 'top right',
					template: '<md-toast class="md-toast red">' + error.message + '</md-toast>',
				});
				$scope.vizit_info.primary_teach = null;
			})
	}

	$scope.click_group = function (group) {
		$scope.getPresents({time_line: $scope.cur_lenta, group: group}, null);
	}

	$scope.setWas = function (was, vizit, id_stud, id_schedule, primary_teach, theme, obj_key, was_type) {
		var data = new Date();
		var keyWas = '' + data.getSeconds() + data.getMilliseconds(); // создаем уникальный ключ массива посещаемости;

		if (was && was !== '0' && was_type === null) {
			was_type = $scope.WASTYPE.OFFLINE;
		}

		$scope.wasStud[keyWas] = {
			was: was,
			vizit: vizit,
			id_stud: id_stud,
			id_schedule: id_schedule,
			primary_teach: primary_teach,
			theme: theme,
			was_type: was_type,
		};

		// #KAN-1504 remove this item
		// $rootScope.isLoading = true;
		$scope.addExitEvent();
		$scope.students[obj_key].was = was;
	}

	/**
	 * @type {number}
	 * Отмечаем студентов каждые несколько секунд
	 */
	var setWasByTime = setInterval(function () {
		var dataWas = {...$scope.wasStud};
		if (angular.isDefined(dataWas) && dataWas !== null && Object.keys(dataWas).length > 0 && $scope.startWas !== true) {
			$scope.setWasSingle({'visits': dataWas, schedule: $scope.cur_schedule});
		}
	}, 1000);

	$scope.setWasSingle = function (data) {
		$scope.startWas = true;
		presentsHttp.setWas(data).success(function (r) {
			if (r?.error) {
				$mdToast.show({
					hideDelay: 4000,
					position: 'top right',
					template: '<md-toast class="md-toast red">' + r.error + '</md-toast>',
				});

				return;
			}
			$scope.startWas = false;
			$scope.removeExitEvent();
			// #KAN-1504 remove this item
			// $rootScope.isLoading = false;
			// #KAN-1504 add this item

			$mdToast.show({
				hideDelay: 3000,
				position: 'top right',
				template: '<md-toast class="md-toast green">' + $filter('translate')('save_attendance_student_success') + '</md-toast>',
			});

			var dataWas = $scope.wasStud;
			angular.forEach(data.visits, function (value, key) {
				delete dataWas[key];
			});
			if (r?.new_id_vizit) {
				$scope.students = $scope.students.map(function (val) {
					if (r.new_id_vizit[val['id_stud']]) {
						val['id_vizit'] = r.new_id_vizit[val['id_stud']].id_vizit;
					}
					return val;
				});
				return $scope.cur_was;
			}
		});
	};

	$scope.setWasAllOnline = function (isWasAllOnline) {
		$scope.isAllOnline = !$scope.isAllOnline;
		$scope.setWasTypeAll(isWasAllOnline);
	}

	$scope.setWasTypeAll = function (isWasAllOnline = false) {
		$scope.ShowVizit = false;
		const data = {
			lenta: $scope.cur_lenta,
			group: $scope.cur_group,
			date: $scope.cur_date,
			schedule: $scope.cur_schedule,
			was_type: $scope.isAllOnline ? $scope.WASTYPE.ONLINE : $scope.WASTYPE.OFFLINE,
		}
		presentsHttp.setWasTypeAll(data).success(function (r) {
			if (r) {
				if (r.error) {
					$mdToast.show({
						hideDelay: 4000,
						position: 'top right',
						template: '<md-toast class="md-toast red">' + r.error + '</md-toast>',
					});

					return;
				}
				if (isWasAllOnline) {
					$scope.students = $scope.students.map(function (val) {
						val['was_type'] = $scope.isAllOnline ? $scope.WASTYPE.ONLINE : $scope.WASTYPE.OFFLINE
						return val;
					});
				} else {
					$scope.students = $scope.students.map(function (val) {
						val['was'] = val['id_vizit'] ? WAS_TRUE : val['was'];
						return val;
					});
				}

				// #KAN-1504 add this item
				$mdToast.show({
					hideDelay: 3000,
					position: 'top right',
					template: '<md-toast class="md-toast green">' + $filter('translate')('save_attendance_students_success') + '</md-toast>',
				});
			}
		})
	}

	$scope.setWasAll = function (isWasAllOnline = false) {
		$scope.ShowVizit = false;
		presentsHttp.setWasAll({
			lenta: $scope.cur_lenta,
			group: $scope.cur_group,
			date: $scope.cur_date,
			schedule: $scope.cur_schedule,
			was_type: $scope.isAllOnline ? $scope.WASTYPE.ONLINE : $scope.WASTYPE.OFFLINE,
		}).success(function (r) {
			if (r) {
				if (r.error) {
					$mdToast.show({
						hideDelay: 4000,
						position: 'top right',
						template: '<md-toast class="md-toast red">' + r.error + '</md-toast>',
					});

					return;
				}
				if (isWasAllOnline) {
					$scope.students = $scope.students.map(function (val) {
						val['was_type'] = $scope.isAllOnline ? $scope.WASTYPE.ONLINE : $scope.WASTYPE.OFFLINE
						return val;
					});
				} else {
					$scope.students = $scope.students.map(function (val) {
						val['was'] = val['id_vizit'] ? WAS_TRUE : val['was'];
						return val;
					});
				}

				// #KAN-1504 add this item
				$mdToast.show({
					hideDelay: 3000,
					position: 'top right',
					template: '<md-toast class="md-toast green">' + $filter('translate')('save_attendance_students_success') + '</md-toast>',
				});
			}
		})
	}

	/**
	 * Проставка оценки (собирается в $scope.markStud)
	 * @param type - Тип оценки.
	 * @param mark - Оценка.
	 * @param vizit - id посещения.
	 * @param obj_key - Ключ объекта массива студентов.
	 */
	$scope.setMark = function (type, mark, vizit, obj_key) {
		var data = new Date();
		var keyMark = '' + data.getSeconds() + data.getMilliseconds();//создаем уникальный ключ массива оценок
		$scope.markStud[keyMark] = {
			type: type,
			mark: mark,
			vizit: vizit,
		};

		$scope.addExitEvent();

		if (type === $scope.TYPE_MARK_TEST_WORK) {
			$scope.students[obj_key].mark2 = mark;
		} else if (type === $scope.TYPE_MARK_CLASSWORK) {
			$scope.students[obj_key].mark4 = mark;
		}
	};

	/**
	 * Проставляем оценки студентам каждые несколько секунд
	 * @type {number}
	 */
	var setMarkByTime = setInterval(function () {
		var dataMark = {...$scope.markStud};
		var canSetMark = angular.isDefined(dataMark) && true && Object.keys(dataMark).length > 0 && $scope.startMark !== true
			&& $scope.startWas !== true;
		if (canSetMark) {
			$scope.setMarkSend({'marks': dataMark});
		}
	}, 1000);

	/**
	 * Отправка данных с оценками.
	 *
	 * @param data[] - Данные с оценками.
	 */
	$scope.setMarkSend = function (data) {
		$scope.startMark = true;
		presentsHttp.setMark(data).success(function (r) {
			$scope.startMark = false;
			$scope.removeExitEvent();

			var dataMark = $scope.markStud;
			angular.forEach(data.marks, function (value, key) {
				delete dataMark[key];
			});

			if (r?.error) {
				$mdToast.show({
					hideDelay: 4000,
					position: 'top right',
					template: '<md-toast class="md-toast red">' + r.error + '</md-toast>',
				});
			} else {
				$mdToast.show({
					hideDelay: 3000,
					position: 'top right',
					template: '<md-toast class="md-toast green">' + $filter('translate')('save_rating_success ') + '</md-toast>',
				});
			}
		});
	};

	/**
	 * Проставка награды (алмазов) (собирается в $scope.prizeStud)
	 * @param stud - объект данных студента
	 * @param obj_key - Ключ объекта массива студентов.
	 */
	$scope.setPrize = function (stud, obj_key) {
		var data = new Date();
		var keyPrize = '' + data.getSeconds() + data.getMilliseconds(); // создаем уникальный ключ массива наград
		$scope.prizeStud[keyPrize] = {
			id: stud.id_vizit,
			reward: stud.prize,
		};

		$scope.addExitEvent();

		$scope.students[obj_key].prize = stud.prize;
	};

	/**
	 * Проставляем награды студентам каждые несколько секунд
	 * @type {number}
	 */
	var setPrizeByTime = setInterval(function () {
		var dataPrize = {...$scope.prizeStud};
		var canSetPrize = angular.isDefined(dataPrize) && true && Object.keys(dataPrize).length > 0 && $scope.startPrize !== true && $scope.setWas
			&& $scope.startWas !== true;
		if (canSetPrize) {
			$scope.setPrizeSend({'prizes': dataPrize});
		}
	}, 1000);

	/**
	 * Отправка данных с наградами.
	 * @param data[] - Данные с наградами.
	 */
	$scope.setPrizeSend = function (data) {
		$scope.startPrize = true;
		presentsHttp.setPrize(data).success(function (r) {
			$scope.startPrize = false;
			$scope.removeExitEvent();

			var dataPrize = $scope.prizeStud;
			angular.forEach(data.prizes, function (value, key) {
				delete dataPrize[key];
			});

			if (r.error) {
				$scope.getPresents({
					time_line: $scope.cur_lenta,
					group: $scope.cur_group,
					date: $scope.cur_date,
				}, {'show-loader': ''});

				$mdToast.show({
					hideDelay: 4000,
					position: 'top right',
					template: '<md-toast class="md-toast red">' + r.error + '</md-toast>',
				});
			} else if (r.success) {
				$scope.total.diamondsCount = r.total;
				let cur_reward;  // кол-во алмазов
				for (let key in data.prizes) {
					if (data.prizes[key].reward) {
						cur_reward = +data.prizes[key].reward;
					}
				}

				$mdToast.show({
					hideDelay: 3000,
					position: 'top right',
					template: `<md-toast class="md-toast green">${cur_reward === $scope.REMOVE_REWARD ? $filter('translate')('remove_reward_success') : $filter('translate')('add_reward_success')}</md-toast>`,
				});
			}
		});
	};

	$scope.copyFromPrev = function () {
		presentsHttp.copyFromPrev({
			lenta: $scope.cur_lenta,
			group: $scope.cur_group,
			spec: $scope.cur_spec.id_spec,
			date: $scope.cur_date,
			schedule: $scope.cur_schedule,
		}).success(function (r) {
			if (r?.error) {
				$mdToast.show({
					hideDelay: 3000,
					position: 'top right',
					template: '<md-toast class="md-toast red">' + r.message + '</md-toast>',
				});

				return null;
			}

			$scope.getPresents({
				time_line: $scope.cur_lenta,
				group: $scope.cur_group,
				date: $scope.cur_date,
			}, {'show-loader': ''});
		})
			.error(function (error) {
				$mdToast.show({
					hideDelay: 3000,
					position: 'top right',
					template: '<md-toast class="md-toast red">' + error.message + '</md-toast>',
				});
			});
	}

	$scope.getDataRequest = function () {
		presentsHttp.GetDataRequestZavuch().success(function (r) {
			$scope.date_select = r.dates;
			$scope.request_history = r.requests;
			$scope.request = {};
			r.requests.forEach(function (i) {
				if (i.can_set == 1) {
					$scope.can_set_th = true;
				}
			})
		});
	}

	$scope.massages = {};

	$scope.sendRequest = function () {
		presentsHttp.sendRequest($scope.request).success(function (r) {
			$scope.resultRequest = r;
			if (r.success) {
				$scope.messages = r.success;
				$mdToast.show({
					hideDelay: 3000,
					position: 'top right',
					template: '<md-toast class="md-toast green">' + $scope.messages + '</md-toast>',
				});
				$mdDialog.hide();
			} else if (r?.error) {
				$scope.messages = r.error;
				$mdToast.show({
					hideDelay: 3000,
					position: 'top right',
					template: '<md-toast class="md-toast red">' + $scope.messages + '</md-toast>',
				});
			}
		});
	}

	$scope.switchDate = function (date) {
		$scope.cur_date = date;
		$scope.getPresents({}, null);
		$mdDialog.hide();
	}

	$scope.setComment = function (id, id_stud, comment) {
		presentsHttp.setComment({
			id: id,
			id_stud: id_stud,
			comment: comment,
			lesson: $scope.cur_lenta,
			date: $scope.cur_date,
			schedule:$scope.cur_schedule
		}).success(function (r) {
			if (r.success) {
				$scope.messages = r.success;
				$mdToast.show({
					hideDelay: 3000,
					position: 'top right',
					template: '<md-toast class="md-toast green">' + $scope.messages + '</md-toast>',
				});
				$scope.getPresents({time_line: $scope.cur_lenta, group: $scope.cur_group}, null);
			} else if (r?.error) {
				$scope.messages = r.error;
			}
		})
	}

	$scope.unParseComment = function (string) {
		if (angular.isDefined(string) && string) {
			var sub_str = string.substring(string.indexOf(' '));//ищем второй пробел в строке и обрезаем строку)
			return sub_str.substring(sub_str.indexOf(':') + 1);
		}
	};

	$scope.getPresents({
		time_line: $scope.cur_lenta,
		group: $scope.cur_group,
		date: $scope.cur_date,
	}, null);

	// Вызывается при клике на боком меню, раздел Присутствующие,
	// если находимся на этой же странице.
	// Иначе баг - обнуляется localstorage, а контроллер не обновляется. После чего нельзя добавить домашку
	$rootScope.getPresentsRootScope = function () {
		$scope.getPresents({
			group: $scope.cur_group,
			date: $scope.cur_date,
		}, null);
	};

	$scope.stopPair = function (idSchedule) {
		presentsHttp.stopPair({idSchedule: idSchedule}).success(function (r) {
			if (r.success) {
				$scope.end_lenta_time = r.date_end;
			}
		});
	}

	function exitEvent(e) {
		var confirmationMessage = '\o/';
		e.returnValue = confirmationMessage;
		return confirmationMessage;
	}

	/**
	 * Добавляем событие чтобы не закрывали вкладку пока не сохранены присутствующие или оценки
	 */
	$scope.addExitEvent = function () {
		// #KAN-1504 remove this item
		// $scope.userWasSave = false;
		window.addEventListener('beforeunload', exitEvent);
	}

	/**
	 * Удаляем событие чтобы не закрывали вкладку пока не сохранены присутствующие или оценки
	 */
	$scope.removeExitEvent = function () {
		// #KAN-1504 remove this item
		// $scope.userWasSave = true;
		window.removeEventListener('beforeunload', exitEvent);
	}
}

