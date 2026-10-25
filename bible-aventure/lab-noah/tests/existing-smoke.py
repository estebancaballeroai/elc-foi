from playwright.sync_api import sync_playwright, expect

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    page = browser.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    assert page.goto('http://127.0.0.1:8000/').status == 200
    expect(page.locator('#cards .app')).to_have_count(2)
    page.locator('#search').fill('Bible Aventure')
    expect(page.locator('#cards .app')).to_have_count(1)
    page.locator('#search').fill('aucun-resultat-xyz')
    expect(page.locator('#empty')).to_be_visible()
    print('PASS: portail, catalogue et recherche')
    assert page.goto('http://127.0.0.1:8000/bible-aventure/').status == 200
    expect(page.locator('[data-story-select]')).to_have_count(10)
    expect(page.locator('[data-chapter]')).to_have_count(5)
    page.locator('#modeAdventure').click()
    expect(page.locator('#modeAdventure')).to_have_class('mode-chip active')
    page.reload()
    expect(page.locator('#modeAdventure')).to_have_class('mode-chip active')
    print('PASS: dix récits, cinq chapitres et sauvegarde du mode après rechargement')
    page.locator('#startBtn').click()
    page.locator('[data-act="enter-chapter"]').click()
    page.locator('[data-act="close"]').last.click()
    expect(page.locator('#gameScreen')).to_be_visible()
    canvas = page.locator('canvas').first
    expect(canvas).to_be_visible()
    assert canvas.evaluate('(c) => c.width > 0 && c.height > 0')
    page.locator('#homeBtn').click()
    expect(page.locator('#homeScreen')).to_be_visible()
    page.set_viewport_size({'width':390, 'height':844})
    expect(page.locator('#startBtn')).to_be_visible()
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    assert not errors, errors
    print('PASS: ouverture du chapitre, canvas, retour, affichage mobile et aucune erreur JavaScript')
    browser.close()
