let notes ;
let voic;
// 페이지 로드 시 악보를 그리기 위한 함수 정의
function drawSheet() {
    const sheetElement = document.getElementById('sheet');
    const renderer = new Vex.Flow.Renderer(sheetElement, Vex.Flow.Renderer.Backends.SVG);

    renderer.resize(500, 200);
    const context = renderer.getContext();

    const stave = new Vex.Flow.Stave(10, 40, 400);
    stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(context).draw();

    notes = [
        new Vex.Flow.StaveNote({ clef: "treble", keys: ["c/4"], duration: "q" }),
        new Vex.Flow.StaveNote({ clef: "treble", keys: ["d/4"], duration: "q" }),
        new Vex.Flow.StaveNote({ clef: "treble", keys: ["e/4"], duration: "q" }),
        new Vex.Flow.StaveNote({ clef: "treble", keys: ["f/4"], duration: "q" }),
    ];

    voice = new Vex.Flow.Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);

    const formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 400);
    voice.draw(context, stave);
}

// 페이지 로드 시 함수 호출
document.addEventListener("DOMContentLoaded", function () {
    drawSheet();
});

// 음 선택기 및 버튼을 참조
const noteSelector = document.getElementById("note-selector");
const addNoteBtn = document.getElementById("add-note-btn");

// 사용자가 악보에 음을 추가하려고 할 때 호출 될 함수를 정의하고,
// 악보를 다시 그립니다.
function addNote() {
    const selectedNoteKey = noteSelector.value;
    const newNote = new Vex.Flow.StaveNote({
        clef: "treble",
        keys: [selectedNoteKey],
        duration: "q",
    });

    notes.push(newNote);
    voice.addTickables([newNote]);
    drawSheet();
}

// 사용자가 음을 추가하려고 할 때 'addNote' 함수가 호출되도록 이벤트 리스너를 추가합니다.
addNoteBtn.addEventListener("click", addNote);

// save the note
const saveBtn = document.getElementById("save-btn");
const downloadLink = document.getElementById("download-link");

// 악보 저장 기능을 구현한 함수를 정의합니다.
function saveSheet() {
    const musicXmlData = generateMusicXmlData(notes); // 알맞은 MusicXML 데이터를 생성하는 함수를 작성하세요.
    const blob = new Blob([musicXmlData]);
    const url = URL.createObjectURL(blob);

    downloadLink.href = url;
    downloadLink.click();
}

saveBtn.addEventListener("click", saveSheet);

// play the song
let audioContext;

function initAudio() {
    audioContext = new AudioContext();
}

function playNote(frequency, duration) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = "sine";
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// 재생 버튼 추가 (index.html):
//<button id="play-btn">Play</button>

// JavaScript:
const playBtn = document.getElementById("play-btn");

function playSheet() {
    const delayBetweenNotes = 500;
    let currentTime = 0;

    for (const note of notes) {
        const frequency = getFrequencyForNote(note); // 음의 높이에 따른 주파수를 반환하는 함수를 작성하세요.
        setTimeout(() => playNote(frequency, 1), currentTime);
        currentTime += delayBetweenNotes;
    }
}

playBtn.addEventListener("click", playSheet);

initAudio();
