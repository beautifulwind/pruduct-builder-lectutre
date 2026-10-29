// 다크/라이트 모드 전환 (초기 테마는 각 페이지 <head>의 인라인 스크립트가 적용)
(function () {
    var toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    function render() {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        toggle.textContent = isDark ? '☀️ 라이트' : '🌙 다크';
        toggle.setAttribute('aria-label', isDark ? '라이트 모드로 전환' : '다크 모드로 전환');
    }

    toggle.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
        render();
        // Disqus는 로드 시점의 배경색으로 테마를 정하므로, 전환이 끝난 뒤 다시 불러온다
        if (window.DISQUS && window.disqus_config) {
            setTimeout(function () {
                DISQUS.reset({ reload: true, config: disqus_config });
            }, 250);
        }
    });

    render();
})();

// 문의 폼 (Formspree) 비동기 전송
(function () {
    var form = document.getElementById('contactForm');
    if (!form) return;
    var status = document.getElementById('formStatus');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var submit = form.querySelector('button[type="submit"]');
        submit.disabled = true;
        status.textContent = '보내는 중...';

        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        }).then(function (res) {
            if (!res.ok) throw new Error();
            form.reset();
            status.textContent = '문의가 접수되었습니다. 영업일 기준 2~3일 안에 답변드리겠습니다.';
        }).catch(function () {
            status.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
        }).finally(function () {
            submit.disabled = false;
        });
    });
})();

// Disqus 댓글 (글 페이지에만 존재)
(function () {
    if (!document.getElementById('disqus_thread')) return;
    window.disqus_config = function () {
        this.page.url = location.origin + location.pathname;
        this.page.identifier = location.pathname;
    };
    var d = document, s = d.createElement('script');
    s.src = 'https://productbuilder-jjmayjcvqs.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
})();
