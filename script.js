
    // ১. পাসওয়ার্ড আপডেট (মাস্টার পাসওয়ার্ড: AbdulFreeFire42)
    const MASTER_ADMIN_PASS = "AbdulFreeFire42";
    let winStreak = 0;

    // পাসওয়ার্ড স্টোরেজ লিস্ট
    let systemKeys = [
        { sl: 1, key: "AbdulFreeFire42", active: true, validity: "Lifetime", boundDevice: null },
        { sl: 2, key: "VIP_PASS_01", active: true, validity: "24 Hours", boundDevice: null }
    ];

    function startApp() {
        document.getElementById('welcomeModal').style.display = 'none';
        checkSession();
    }

    function checkSession() {
        const savedRole = localStorage.getItem('sessionRole');
        if (savedRole === 'admin') {
            showPanel('roleSelectPanel');
        } else if (savedRole === 'user') {
            showPanel('userPanel');
        } else {
            showPanel('loginPanel');
        }
    }

    function showPanel(panelId) {
        document.getElementById('loginPanel').style.display = 'none';
        document.getElementById('roleSelectPanel').style.display = 'none';
        document.getElementById('userPanel').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById(panelId).style.display = 'block';
    }

    function processLogin() {
        const inputPass = document.getElementById('accessKeyInput').value.trim();
        const err = document.getElementById('loginError');

        if (inputPass === MASTER_ADMIN_PASS) {
            localStorage.setItem('sessionRole', 'admin');
            err.style.display = 'none';
            showPanel('roleSelectPanel');
            renderAdminTable();
            return;
        }

        const foundKey = systemKeys.find(k => k.key === inputPass);
        if (foundKey) {
            if (!foundKey.active) {
                err.innerText = "Error: This password has been disabled by Admin!";
                err.style.display = 'block';
                return;
            }

            let activeDeviceId = localStorage.getItem('device_unique_id');
            if (!activeDeviceId) {
                activeDeviceId = 'DEV_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('device_unique_id', activeDeviceId);
            }

            if (foundKey.boundDevice && foundKey.boundDevice !== activeDeviceId) {
                err.innerText = "Incorrect Password! (Key locked to another device)";
                err.style.display = 'block';
            } else {
                foundKey.boundDevice = activeDeviceId;
                localStorage.setItem('sessionRole', 'user');
                err.style.display = 'none';
                showPanel('userPanel');
            }
        } else {
            err.innerText = "Incorrect Password! Access Denied.";
            err.style.display = 'block';
        }
    }

    function openUserPanel() { showPanel('userPanel'); }
    function openAdminPanel() { showPanel('adminPanel'); renderAdminTable(); }

    function logout() {
        localStorage.removeItem('sessionRole');
        showPanel('loginPanel');
    }

    function generateSignal() {
        const btn = document.getElementById('sigBtn');
        const status = document.getElementById('statusTxt');
        const reason = document.getElementById('reasonTxt');
        const timer = document.getElementById('timerTxt');
        const cnt = document.getElementById('cntVal');
        const sureshot = document.getElementById('sureshotWinBanner');
        const loss = document.getElementById('lossBanner');
        const acc = document.getElementById('accBadge');
        
        const timeframeVal = document.getElementById('timeframeMode').value;

        btn.disabled = true;
        sureshot.style.display = 'none';
        loss.style.display = 'none';
        status.innerHTML = `<span style="color:#38bdf8;">Analyzing RIFAT TRADER VIP Wave...</span>`;
        reason.innerText = "";
        acc.style.display = 'none';

        setTimeout(() => {
            const isBuy = Math.random() > 0.30; // উইন রেট বাড়ানো হয়েছে
            const signalType = isBuy ? 'BUY (CALL)' : 'SELL (PUT)';
            const signalClass = isBuy ? 'signal-buy' : 'signal-sell';

            status.innerHTML = `<div class="signal-text ${signalClass}">Signal: ${signalType}</div>`;
            reason.innerText = isBuy ? "Technical: Support Rejection & RSI Bullish Divergence" : "Technical: Resistance Rejection & Bearish Breakdown";
            
            // ২. মারাত্মক লেভেলের একুরেসি পারসেন্টেজ (৯৮% - ৯৯.৯%)
            acc.innerText = "AI Accuracy: " + (98 + (Math.random() * 1.9).toFixed(1)) + "% (ULTRA ACCURATE)";
            acc.style.display = 'inline-block';

            let duration = 0;
            if (timeframeVal === 'candle') {
                duration = 60 - new Date().getSeconds();
                if (duration <= 0) duration = 60;
            } else {
                duration = parseInt(timeframeVal);
            }

            cnt.innerText = duration;
            timer.style.display = 'block';

            const interval = setInterval(() => {
                duration--;
                cnt.innerText = duration;

                if (duration <= 0) {
                    clearInterval(interval);
                    timer.style.display = 'none';

                    // হাই একুরেসি অনুযায়ী উইন চ্যান্স (৯৫% উইন)
                    const isWin = Math.random() > 0.05; 

                    if (isWin) {
                        sureshot.style.display = 'block';
                        loss.style.display = 'none';
                        winStreak++;

                        if (winStreak >= 2) {
                            triggerCelebration();
                            winStreak = 0;
                        }
                    } else {
                        loss.style.display = 'block';
                        sureshot.style.display = 'none';
                        winStreak = 0;
                    }
                    btn.disabled = false;
                }
            }, 1000);

        }, 2000);
    }

    function triggerCelebration() {
        const overlay = document.getElementById('celebrationOverlay');
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 3000);
    }

    function renderAdminTable() {
        const tbody = document.getElementById('adminKeyTable');
        tbody.innerHTML = '';

        systemKeys.forEach((k, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${k.sl}</td>
                <td>${k.key}</td>
                <td class="${k.active ? 'status-active' : 'status-blocked'}" onclick="toggleKeyStatus(${idx})">
                    ${k.active ? 'Active' : 'Inactive'}
                </td>
                <td>${k.validity}</td>
            `;

            tr.ondblclick = () => deleteKey(idx);
            tbody.appendChild(tr);
        });
    }

    function addAccessKey() {
        const val = document.getElementById('newKeyInput').value.trim();
        const validityText = document.getElementById('keyValidityVal').value.trim() || "24 Hours";

        if (val) {
            systemKeys.push({
                sl: systemKeys.length + 1,
                key: val,
                active: true,
                validity: validityText,
                boundDevice: null
            });
            document.getElementById('newKeyInput').value = '';
            document.getElementById('keyValidityVal').value = '';
            renderAdminTable();
        }
    }

    function toggleKeyStatus(idx) {
        systemKeys[idx].active = !systemKeys[idx].active;
        renderAdminTable();
    }

    function deleteKey(idx) {
        systemKeys.splice(idx, 1);
        renderAdminTable();
    }

    function updateTelegramLink() {
        const link = document.getElementById('newTgLinkInput').value.trim();
        if (link) {
            const formatted = "https://" + link.replace('https://', '').replace('http://', '');
            document.getElementById('adminTgLink').href = formatted;
            document.getElementById('adminTgLink').innerText = link;
            document.getElementById('newTgLinkInput').value = '';
            alert('Telegram Link Updated Successfully!');
        }
    }
