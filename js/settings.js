document.addEventListener('DOMContentLoaded', function() {
    // ==================== CONFIGURAÇÕES PADRÃO ====================
    const DEFAULT_SETTINGS = {
        general: {
            language: 'pt-BR',
            timeFormat: '24',
            dateFormat: 'dd/mm/yyyy',
            defaultExportFormat: 'pdf'
        },
        schedule: {
            defaultMorningIn: '06:00',
            defaultMorningOut: '11:30',
            defaultAfternoonIn: '13:00',
            defaultAfternoonOut: '18:00',
            departmentSchedules: []
        },
        policies: {
            lateTolerance: 15,
            minimumHoursPerDay: 8,
            minimumHoursPerWeek: 40,
            maxAbsencesPerMonth: 3,
            holidays: []
        },
        users: {
            profiles: {
                admin: { name: 'Admin', permissions: ['all'] },
                manager: { name: 'Gerente', permissions: ['point', 'reports', 'edit'] },
                rh: { name: 'RH', permissions: ['reports', 'employees', 'export'] },
                employee: { name: 'Funcionário', permissions: ['point', 'view_own'] }
            },
            usersList: []
        },
        appearance: {
            theme: 'light',
            primaryColor: '#007bff',
            secondaryColor: '#6c757d'
        }
    };

    // ==================== CARREGAMENTO INICIAL ====================
    const loadSettings = () => {
        const saved = JSON.parse(localStorage.getItem('platformSettings')) || DEFAULT_SETTINGS;
        return { ...DEFAULT_SETTINGS, ...saved };
    };

    let currentSettings = loadSettings();

    // ==================== SISTEMA DE ABAS ====================
    const setupTabs = () => {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                
                // Remove active de todos
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Adiciona active ao clicado
                button.classList.add('active');
                document.querySelector(`.tab-content[data-tab="${tabName}"]`).classList.add('active');
            });
        });
    };

    // ==================== GERAL ====================
    const setupGeneralTab = () => {
        const general = currentSettings.general;
        document.getElementById('languageSelect').value = general.language;
        document.getElementById('timeFormat').value = general.timeFormat;
        document.getElementById('dateFormat').value = general.dateFormat;
        document.getElementById('defaultExportFormat').value = general.defaultExportFormat;
    };

    // ==================== HORÁRIOS ====================
    const setupScheduleTab = () => {
        const schedule = currentSettings.schedule;
        
        // Horários padrão
        document.getElementById('defaultMorningIn').value = schedule.defaultMorningIn;
        document.getElementById('defaultMorningOut').value = schedule.defaultMorningOut;
        document.getElementById('defaultAfternoonIn').value = schedule.defaultAfternoonIn;
        document.getElementById('defaultAfternoonOut').value = schedule.defaultAfternoonOut;

        // Horários por departamento
        renderDepartmentSchedules();
    };

    const renderDepartmentSchedules = () => {
        const container = document.getElementById('departmentSchedules');
        const schedules = currentSettings.schedule.departmentSchedules;

        container.innerHTML = schedules.map((dept, idx) => `
            <div class="department-schedule-item">
                <input type="text" placeholder="Nome do departamento" value="${dept.name}" class="dept-name" data-idx="${idx}">
                <div class="time-inputs">
                    <input type="time" class="dept-morning-in" value="${dept.morningIn}" data-idx="${idx}">
                    <span>-</span>
                    <input type="time" class="dept-morning-out" value="${dept.morningOut}" data-idx="${idx}">
                </div>
                <div class="time-inputs">
                    <input type="time" class="dept-afternoon-in" value="${dept.afternoonIn}" data-idx="${idx}">
                    <span>-</span>
                    <input type="time" class="dept-afternoon-out" value="${dept.afternoonOut}" data-idx="${idx}">
                </div>
                <button class="delete-btn" data-idx="${idx}">🗑</button>
            </div>
        `).join('');

        // Eventos de exclusão
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                currentSettings.schedule.departmentSchedules.splice(idx, 1);
                renderDepartmentSchedules();
            });
        });
    };

    document.getElementById('addDepartmentSchedule').addEventListener('click', () => {
        currentSettings.schedule.departmentSchedules.push({
            name: '',
            morningIn: '06:00',
            morningOut: '11:30',
            afternoonIn: '13:00',
            afternoonOut: '18:00'
        });
        renderDepartmentSchedules();
    });

    // ==================== POLÍTICAS ====================
    const setupPoliciesTab = () => {
        const policies = currentSettings.policies;
        
        document.getElementById('lateTolerance').value = policies.lateTolerance;
        document.getElementById('minimumHoursPerDay').value = policies.minimumHoursPerDay;
        document.getElementById('minimumHoursPerWeek').value = policies.minimumHoursPerWeek;
        document.getElementById('maxAbsencesPerMonth').value = policies.maxAbsencesPerMonth;

        renderHolidays();
    };

    const renderHolidays = () => {
        const container = document.getElementById('holidaysList');
        const holidays = currentSettings.policies.holidays;

        container.innerHTML = holidays.map((holiday, idx) => `
            <div class="holiday-item">
                <input type="date" value="${holiday.date}" class="holiday-date" data-idx="${idx}">
                <input type="text" placeholder="Nome do feriado" value="${holiday.name}" class="holiday-name" data-idx="${idx}">
                <button class="delete-btn" data-idx="${idx}">🗑</button>
            </div>
        `).join('');

        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                currentSettings.policies.holidays.splice(idx, 1);
                renderHolidays();
            });
        });
    };

    document.getElementById('addHoliday').addEventListener('click', () => {
        currentSettings.policies.holidays.push({
            date: new Date().toISOString().split('T')[0],
            name: ''
        });
        renderHolidays();
    });

    // ==================== USUÁRIOS & PERFIS ====================
    const setupUsersTab = () => {
        renderUsersList();
    };

    const renderUsersList = () => {
        const container = document.getElementById('usersList');
        const users = currentSettings.users.usersList;

        if (users.length === 0) {
            container.innerHTML = '<p class="no-data">Nenhum usuário cadastrado</p>';
            return;
        }

        container.innerHTML = users.map((user, idx) => `
            <div class="user-item">
                <div class="user-info">
                    <strong>${user.name}</strong>
                    <span class="user-role">${user.role}</span>
                </div>
                <div class="user-email">${user.email}</div>
                <div class="user-profile">Perfil: ${currentSettings.users.profiles[user.profile]?.name || 'N/A'}</div>
                <button class="delete-btn" data-idx="${idx}">Remover</button>
            </div>
        `).join('');

        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.idx);
                currentSettings.users.usersList.splice(idx, 1);
                renderUsersList();
            });
        });
    };

    document.getElementById('addUser').addEventListener('click', () => {
        const name = prompt('Nome do usuário:');
        if (!name) return;
        
        const email = prompt('Email:');
        if (!email) return;
        
        const profileOptions = Object.keys(currentSettings.users.profiles).join(', ');
        const profile = prompt(`Perfil (${profileOptions}):`);
        if (!profile || !currentSettings.users.profiles[profile]) return;

        currentSettings.users.usersList.push({
            name,
            email,
            role: 'Funcionário',
            profile,
            createdAt: new Date().toISOString()
        });

        renderUsersList();
    });

    // ==================== BACKUP ====================
    const setupBackupTab = () => {
        // Exportar backup
        document.getElementById('exportBackup').addEventListener('click', () => {
            const backupData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                data: {
                    employees: JSON.parse(localStorage.getItem('employees')) || [],
                    pointData: JSON.parse(localStorage.getItem('pointData')) || [],
                    settings: currentSettings
                }
            };

            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2)));
            element.setAttribute('download', `backup_${new Date().toISOString().split('T')[0]}.json`);
            element.style.display = 'none';
            
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);

            showBackupStatus('✅ Backup exportado com sucesso!', 'success');
        });

        // Importar backup
        document.getElementById('importBackupFile').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const backupData = JSON.parse(event.target.result);
                    
                    if (backupData.version !== '1.0') {
                        throw new Error('Versão de backup incompatível');
                    }

                    if (confirm('Isso vai sobrescrever todos os dados. Tem certeza?')) {
                        localStorage.setItem('employees', JSON.stringify(backupData.data.employees));
                        localStorage.setItem('pointData', JSON.stringify(backupData.data.pointData));
                        localStorage.setItem('platformSettings', JSON.stringify(backupData.data.settings));
                        
                        currentSettings = backupData.data.settings;
                        loadAllSettings();
                        showBackupStatus('✅ Backup restaurado com sucesso!', 'success');
                    }
                } catch (error) {
                    showBackupStatus(`❌ Erro ao restaurar: ${error.message}`, 'error');
                }
            };
            reader.readAsText(file);
        });
    };

    const showBackupStatus = (message, type) => {
        const status = document.getElementById('backupStatus');
        status.textContent = message;
        status.className = `backup-status ${type}`;
        
        setTimeout(() => {
            status.textContent = '';
            status.className = 'backup-status';
        }, 3000);
    };

    // ==================== APARÊNCIA ====================
    const setupAppearanceTab = () => {
        const appearance = currentSettings.appearance;
        
        // Tema
        document.querySelectorAll('.theme-btn').forEach(btn => {
            if (btn.dataset.theme === appearance.theme) {
                btn.classList.add('active');
            }
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                appearance.theme = e.target.dataset.theme;
                applyTheme(appearance.theme);
            });
        });

        // Cores
        document.getElementById('primaryColor').value = appearance.primaryColor;
        document.getElementById('secondaryColor').value = appearance.secondaryColor;

        document.getElementById('primaryColor').addEventListener('change', (e) => {
            appearance.primaryColor = e.target.value;
            applyColors();
        });

        document.getElementById('secondaryColor').addEventListener('change', (e) => {
            appearance.secondaryColor = e.target.value;
            applyColors();
        });

        applyTheme(appearance.theme);
        applyColors();
    };

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else if (theme === 'light') {
            document.body.classList.remove('dark-theme');
        } else if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            prefersDark ? document.body.classList.add('dark-theme') : document.body.classList.remove('dark-theme');
        }
    };

    const applyColors = () => {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', currentSettings.appearance.primaryColor);
        root.style.setProperty('--secondary-color', currentSettings.appearance.secondaryColor);
    };

    // ==================== SALVAR E CARREGAR ====================
    const loadAllSettings = () => {
        setupGeneralTab();
        setupScheduleTab();
        setupPoliciesTab();
        setupUsersTab();
        setupBackupTab();
        setupAppearanceTab();
    };

    document.getElementById('saveSettings').addEventListener('click', () => {
        // Atualizar geral
        currentSettings.general = {
            language: document.getElementById('languageSelect').value,
            timeFormat: document.getElementById('timeFormat').value,
            dateFormat: document.getElementById('dateFormat').value,
            defaultExportFormat: document.getElementById('defaultExportFormat').value
        };

        // Atualizar horários
        currentSettings.schedule.defaultMorningIn = document.getElementById('defaultMorningIn').value;
        currentSettings.schedule.defaultMorningOut = document.getElementById('defaultMorningOut').value;
        currentSettings.schedule.defaultAfternoonIn = document.getElementById('defaultAfternoonIn').value;
        currentSettings.schedule.defaultAfternoonOut = document.getElementById('defaultAfternoonOut').value;

        // Atualizar departamentos
        const deptItems = document.querySelectorAll('.department-schedule-item');
        currentSettings.schedule.departmentSchedules = Array.from(deptItems).map(item => ({
            name: item.querySelector('.dept-name').value,
            morningIn: item.querySelector('.dept-morning-in').value,
            morningOut: item.querySelector('.dept-morning-out').value,
            afternoonIn: item.querySelector('.dept-afternoon-in').value,
            afternoonOut: item.querySelector('.dept-afternoon-out').value
        }));

        // Atualizar políticas
        currentSettings.policies = {
            lateTolerance: parseInt(document.getElementById('lateTolerance').value),
            minimumHoursPerDay: parseFloat(document.getElementById('minimumHoursPerDay').value),
            minimumHoursPerWeek: parseFloat(document.getElementById('minimumHoursPerWeek').value),
            maxAbsencesPerMonth: parseInt(document.getElementById('maxAbsencesPerMonth').value),
            holidays: currentSettings.policies.holidays
        };

        // Salvar no localStorage
        localStorage.setItem('platformSettings', JSON.stringify(currentSettings));

        // Feedback
        const btn = document.getElementById('saveSettings');
        const originalText = btn.textContent;
        btn.textContent = '✅ Salvo com sucesso!';
        btn.style.background = '#28a745';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    });

    document.getElementById('resetSettings').addEventListener('click', () => {
        if (confirm('Restaurar todas as configurações padrão? Isso não pode ser desfeito.')) {
            localStorage.removeItem('platformSettings');
            currentSettings = loadSettings();
            loadAllSettings();
            alert('Configurações restauradas com sucesso!');
        }
    });

    // ==================== INICIALIZAÇÃO ====================
    setupTabs();
    loadAllSettings();
});