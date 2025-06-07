document.addEventListener('DOMContentLoaded', function() {
    // Load saved settings
    const loadSettings = () => {
        const settings = JSON.parse(localStorage.getItem('systemSettings')) || getDefaultSettings();
        
        document.getElementById('timeFormat').value = settings.timeFormat;
        document.getElementById('workStartTime').value = settings.workStartTime;
        document.getElementById('workEndTime').value = settings.workEndTime;
        document.getElementById('lunchStartTime').value = settings.lunchStartTime;
        document.getElementById('lunchEndTime').value = settings.lunchEndTime;
        document.getElementById('defaultExportFormat').value = settings.defaultExportFormat;
    };

    // Get default settings
    const getDefaultSettings = () => {
        return {
            timeFormat: '24',
            workStartTime: '08:00',
            workEndTime: '18:00',
            lunchStartTime: '12:00',
            lunchEndTime: '13:00',
            defaultExportFormat: 'pdf'
        };
    };

    // Save settings
    document.getElementById('saveSettings').addEventListener('click', () => {
        const settings = {
            timeFormat: document.getElementById('timeFormat').value,
            workStartTime: document.getElementById('workStartTime').value,
            workEndTime: document.getElementById('workEndTime').value,
            lunchStartTime: document.getElementById('lunchStartTime').value,
            lunchEndTime: document.getElementById('lunchEndTime').value,
            defaultExportFormat: document.getElementById('defaultExportFormat').value
        };

        localStorage.setItem('systemSettings', JSON.stringify(settings));
        alert(window.langManager.translate('settingsSaved'));
    });

    // Reset settings
    document.getElementById('resetSettings').addEventListener('click', () => {
        if (confirm(window.langManager.translate('confirmReset'))) {
            localStorage.setItem('systemSettings', JSON.stringify(getDefaultSettings()));
            loadSettings();
            alert(window.langManager.translate('settingsReset'));
        }
    });

    // Initialize
    loadSettings();
});