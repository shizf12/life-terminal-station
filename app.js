// 生命终点站 - 临终关怀应用主逻辑

// 数据存储
class DataStore {
    constructor() {
        this.storageKey = 'life_terminal_station';
        this.data = this.load();
    }

    load() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : {
            lifeExpectancy: null,
            birthDate: null,
            wills: [],
            belongings: [],
            funeralPlan: null,
            letters: [],
            medicalDirective: null
        };
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    getWills() {
        return this.data.wills;
    }

    addWill(will) {
        will.id = Date.now();
        will.createdAt = new Date().toISOString();
        this.data.wills.push(will);
        this.save();
        return will;
    }

    deleteWill(id) {
        this.data.wills = this.data.wills.filter(w => w.id !== id);
        this.save();
    }

    getBelongings() {
        return this.data.belongings;
    }

    addBelonging(item) {
        item.id = Date.now();
        item.createdAt = new Date().toISOString();
        this.data.belongings.push(item);
        this.save();
        return item;
    }

    deleteBelonging(id) {
        this.data.belongings = this.data.belongings.filter(b => b.id !== id);
        this.save();
    }

    getLetters() {
        return this.data.letters;
    }

    addLetter(letter) {
        letter.id = Date.now();
        letter.createdAt = new Date().toISOString();
        this.data.letters.push(letter);
        this.save();
        return letter;
    }

    deleteLetter(id) {
        this.data.letters = this.data.letters.filter(l => l.id !== id);
        this.save();
    }

    setLifeExpectancy(birthDate, expectancy) {
        this.data.birthDate = birthDate;
        this.data.lifeExpectancy = expectancy;
        this.save();
    }

    getLifeExpectancy() {
        return {
            birthDate: this.data.birthDate,
            lifeExpectancy: this.data.lifeExpectancy
        };
    }

    setFuneralPlan(plan) {
        this.data.funeralPlan = plan;
        this.save();
    }

    getFuneralPlan() {
        return this.data.funeralPlan;
    }

    setMedicalDirective(directive) {
        this.data.medicalDirective = directive;
        this.save();
    }

    getMedicalDirective() {
        return this.data.medicalDirective;
    }
}

// 初始化数据存储
const store = new DataStore();

// 页面导航
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCountdown();
    initWillModule();
    initBelongingModule();
    initFuneralModule();
    initLetterModule();
    initMedicalModule();
    initModal();
});

// 导航功能
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const pages = document.querySelectorAll('.page');
    const actionCards = document.querySelectorAll('.action-card');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            switchPage(targetId);
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    actionCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetPage = card.getAttribute('data-page');
            switchPage(targetPage);
            
            navLinks.forEach(l => {
                l.classList.remove('active');
                if (l.getAttribute('href') === `#${targetPage}`) {
                    l.classList.add('active');
                }
            });
        });
    });
}

function switchPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === pageId) {
            page.classList.add('active');
        }
    });
    window.scrollTo(0, 0);
}

// 生命倒计时功能
function initCountdown() {
    const lifeData = store.getLifeExpectancy();
    
    if (lifeData.birthDate && lifeData.lifeExpectancy) {
        startCountdown(lifeData.birthDate, lifeData.lifeExpectancy);
    } else {
        showEmptyCountdown();
    }

    document.getElementById('setLifeExpectancy').addEventListener('click', () => {
        document.getElementById('lifeModal').classList.add('show');
    });
}

function startCountdown(birthDate, lifeExpectancy) {
    const birth = new Date(birthDate);
    const death = new Date(birth);
    death.setFullYear(birth.getFullYear() + parseInt(lifeExpectancy));

    function updateCountdown() {
        const now = new Date();
        const diff = death - now;

        if (diff <= 0) {
            document.getElementById('years').textContent = '0';
            document.getElementById('months').textContent = '0';
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '0';
            document.getElementById('minutes').textContent = '0';
            return;
        }

        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        document.getElementById('years').textContent = years;
        document.getElementById('months').textContent = months;
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
    }

    updateCountdown();
    setInterval(updateCountdown, 60000); // 每分钟更新一次
}

function showEmptyCountdown() {
    document.getElementById('years').textContent = '-';
    document.getElementById('months').textContent = '-';
    document.getElementById('days').textContent = '-';
    document.getElementById('hours').textContent = '-';
    document.getElementById('minutes').textContent = '-';
}

// 模态框功能
function initModal() {
    const modal = document.getElementById('lifeModal');
    const closeBtn = modal.querySelector('.close');
    const form = document.getElementById('lifeForm');

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const birthDate = document.getElementById('birthDate').value;
        const lifeExpectancy = document.getElementById('lifeExpectancy').value;

        store.setLifeExpectancy(birthDate, lifeExpectancy);
        startCountdown(birthDate, lifeExpectancy);
        modal.classList.remove('show');
        
        alert('生命倒计时已设置');
    });
}

// 遗嘱管理模块
function initWillModule() {
    const form = document.getElementById('willForm');
    const clearBtn = document.getElementById('clearWill');
    const willList = document.getElementById('willList');

    // 加载已有遗嘱
    renderWills();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const will = {
            title: document.getElementById('willTitle').value,
            assets: document.getElementById('willAssets').value,
            beneficiaries: document.getElementById('willBeneficiaries').value,
            special: document.getElementById('willSpecial').value
        };

        store.addWill(will);
        renderWills();
        form.reset();
        
        alert('遗嘱已保存');
    });

    clearBtn.addEventListener('click', () => {
        form.reset();
    });

    function renderWills() {
        const wills = store.getWills();
        
        if (wills.length === 0) {
            willList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📜</div>
                    <p>还没有遗嘱，创建一个吧</p>
                </div>
            `;
            return;
        }

        willList.innerHTML = wills.map(will => `
            <div class="card-item">
                <div class="card-actions">
                    <button class="btn-delete" onclick="deleteWill(${will.id})">删除</button>
                </div>
                <h4>${will.title}</h4>
                <p><strong>财产：</strong>${will.assets.substring(0, 50)}${will.assets.length > 50 ? '...' : ''}</p>
                <p><strong>受益人：</strong>${will.beneficiaries.substring(0, 50)}${will.beneficiaries.length > 50 ? '...' : ''}</p>
                ${will.special ? `<p><strong>特别嘱托：</strong>${will.special.substring(0, 50)}${will.special.length > 50 ? '...' : ''}</p>` : ''}
            </div>
        `).join('');
    }

    window.deleteWill = function(id) {
        if (confirm('确定要删除这份遗嘱吗？')) {
            store.deleteWill(id);
            renderWills();
        }
    };
}

// 遗物整理模块
function initBelongingModule() {
    const form = document.getElementById('belongingForm');
    const belongingList = document.getElementById('belongingList');
    const tabBtns = document.querySelectorAll('.tab-btn');
    let currentFilter = 'all';

    // 类别名称映射
    const categoryNames = {
        'documents': '证件文件',
        'valuables': '贵重物品',
        'mementos': '纪念品',
        'electronics': '电子产品',
        'clothing': '衣物',
        'other': '其他'
    };

    renderBelongings();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const item = {
            name: document.getElementById('itemName').value,
            category: document.getElementById('itemCategory').value,
            location: document.getElementById('itemLocation').value,
            recipient: document.getElementById('itemRecipient').value,
            description: document.getElementById('itemDescription').value
        };

        store.addBelonging(item);
        renderBelongings();
        form.reset();
        
        alert('遗物已添加');
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-category');
            renderBelongings();
        });
    });

    function renderBelongings() {
        let belongings = store.getBelongings();
        
        if (currentFilter !== 'all') {
            belongings = belongings.filter(b => b.category === currentFilter);
        }

        if (belongings.length === 0) {
            belongingList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📦</div>
                    <p>还没有遗物记录</p>
                </div>
            `;
            return;
        }

        belongingList.innerHTML = belongings.map(item => `
            <div class="card-item">
                <div class="card-actions">
                    <button class="btn-delete" onclick="deleteBelonging(${item.id})">删除</button>
                </div>
                <h4>${item.name}</h4>
                <span class="category-tag category-${item.category}">${categoryNames[item.category]}</span>
                <p><strong>存放位置：</strong>${item.location}</p>
                <p><strong>接收人：</strong>${item.recipient || '未指定'}</p>
                ${item.description ? `<p>${item.description}</p>` : ''}
            </div>
        `).join('');
    }

    window.deleteBelonging = function(id) {
        if (confirm('确定要删除这个遗物记录吗？')) {
            store.deleteBelonging(id);
            renderBelongings();
        }
    };
}

// 葬礼规划模块
function initFuneralModule() {
    const form = document.getElementById('funeralForm');
    const savedPlan = store.getFuneralPlan();

    // 如果有保存的规划，填充表单
    if (savedPlan) {
        fillFuneralForm(savedPlan);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const plan = {
            funeralType: document.querySelector('input[name="funeralType"]:checked')?.value || '',
            music: document.getElementById('funeralMusic').value,
            atmosphere: document.getElementById('funeralAtmosphere').value,
            host: document.getElementById('funeralHost').value,
            guests: document.getElementById('funeralGuests').value,
            dress: document.getElementById('funeralDress').value,
            special: document.getElementById('funeralSpecial').value
        };

        store.setFuneralPlan(plan);
        alert('葬礼规划已保存');
    });

    function fillFuneralForm(plan) {
        if (plan.funeralType) {
            const radio = document.querySelector(`input[name="funeralType"][value="${plan.funeralType}"]`);
            if (radio) radio.checked = true;
        }
        document.getElementById('funeralMusic').value = plan.music || '';
        document.getElementById('funeralAtmosphere').value = plan.atmosphere || 'solemn';
        document.getElementById('funeralHost').value = plan.host || '';
        document.getElementById('funeralGuests').value = plan.guests || '';
        document.getElementById('funeralDress').value = plan.dress || '';
        document.getElementById('funeralSpecial').value = plan.special || '';
    }
}

// 告别信模块
function initLetterModule() {
    const form = document.getElementById('letterForm');
    const letterList = document.getElementById('letterList');
    const timingSelect = document.getElementById('letterTiming');
    const dateGroup = document.getElementById('specificDateGroup');

    renderLetters();

    timingSelect.addEventListener('change', () => {
        if (timingSelect.value === 'specific-date') {
            dateGroup.style.display = 'block';
        } else {
            dateGroup.style.display = 'none';
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const letter = {
            recipient: document.getElementById('letterRecipient').value,
            title: document.getElementById('letterTitle').value,
            content: document.getElementById('letterContent').value,
            timing: document.getElementById('letterTiming').value,
            date: document.getElementById('letterDate').value
        };

        store.addLetter(letter);
        renderLetters();
        form.reset();
        dateGroup.style.display = 'none';
        
        alert('告别信已保存');
    });

    function renderLetters() {
        const letters = store.getLetters();
        
        if (letters.length === 0) {
            letterList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">✉️</div>
                    <p>还没有告别信，写一封吧</p>
                </div>
            `;
            return;
        }

        const timingNames = {
            'immediate': '立即发送',
            'after-death': '离世后发送',
            'specific-date': '指定日期'
        };

        letterList.innerHTML = letters.map(letter => `
            <div class="card-item">
                <div class="card-actions">
                    <button class="btn-delete" onclick="deleteLetter(${letter.id})">删除</button>
                </div>
                <h4>${letter.title || '无标题'}</h4>
                <p><strong>收信人：</strong>${letter.recipient}</p>
                <p><strong>发送时机：</strong>${timingNames[letter.timing]}</p>
                ${letter.date && letter.timing === 'specific-date' ? `<p><strong>指定日期：</strong>${letter.date}</p>` : ''}
                <p>${letter.content.substring(0, 100)}${letter.content.length > 100 ? '...' : ''}</p>
            </div>
        `).join('');
    }

    window.deleteLetter = function(id) {
        if (confirm('确定要删除这封告别信吗？')) {
            store.deleteLetter(id);
            renderLetters();
        }
    };
}

// 医疗预嘱模块
function initMedicalModule() {
    const form = document.getElementById('medicalForm');
    const savedDirective = store.getMedicalDirective();

    // 如果有保存的预嘱，填充表单
    if (savedDirective) {
        fillMedicalForm(savedDirective);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const directive = {
            cpr: document.querySelector('input[name="cpr"]:checked')?.value === 'yes',
            intubation: document.querySelector('input[name="intubation"]:checked')?.value === 'yes',
            feedingTube: document.querySelector('input[name="feeding-tube"]:checked')?.value === 'yes',
            dialysis: document.querySelector('input[name="dialysis"]:checked')?.value === 'yes',
            treatmentPreference: document.querySelector('input[name="treatmentPreference"]:checked')?.value || 'comfort',
            finalPlace: document.getElementById('finalPlace').value,
            painManagement: document.getElementById('painManagement').value,
            healthcareProxy: document.getElementById('healthcareProxy').value,
            proxyContact: document.getElementById('proxyContact').value,
            notes: document.getElementById('medicalNotes').value
        };

        store.setMedicalDirective(directive);
        alert('医疗预嘱已保存');
    });

    function fillMedicalForm(directive) {
        if (directive.cpr) document.querySelector('input[name="cpr"][value="yes"]').checked = true;
        if (directive.intubation) document.querySelector('input[name="intubation"][value="yes"]').checked = true;
        if (directive.feedingTube) document.querySelector('input[name="feeding-tube"][value="yes"]').checked = true;
        if (directive.dialysis) document.querySelector('input[name="dialysis"][value="yes"]').checked = true;
        
        if (directive.treatmentPreference) {
            const radio = document.querySelector(`input[name="treatmentPreference"][value="${directive.treatmentPreference}"]`);
            if (radio) radio.checked = true;
        }
        
        document.getElementById('finalPlace').value = directive.finalPlace || 'hospital';
        document.getElementById('painManagement').value = directive.painManagement || 'full';
        document.getElementById('healthcareProxy').value = directive.healthcareProxy || '';
        document.getElementById('proxyContact').value = directive.proxyContact || '';
        document.getElementById('medicalNotes').value = directive.notes || '';
    }
}
