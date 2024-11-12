function similarity(a, b) {
    const NOTE_MAP = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
    
    const parseNum = (onmei, i) => {
      let num = NOTE_MAP[onmei.charAt(0)] ?? null;
      if (num === null) return null;
  
      num += i + (onmei.includes('#') ? 1 : 0) - (onmei.includes('b') ? 1 : 0);
      return num % 12;
    }
  
    const parseTriad = (chordName) => {
      return chordName.replace(/(add9|M9|\+9|M7|7|69|9|dim)/g, match => (match === 'dim' ? 'm-5' : ''));
    }
  
    const PATTERN_MAP = {
      'sus2': [0, 2, 7],
      'sus4': [0, 5, 7],
      'aug': [0, 4, 8],
      'm-5': [0, 3, 6],
      '-5': [0, 4, 6],
      'm': [0, 3, 7],
      'default': [0, 4, 7],
    };
  
    const kouseion = (chord) => {
      const chordName = parseTriad(chord);
      let count = Array(12).fill(0);
  
      const [baseChord, root] = chordName.split('/');
      if (root) count[parseNum(root, 0)] += 1;
  
      const pattern = Object.keys(PATTERN_MAP).find(key => baseChord.includes(key)) || 'default';
      PATTERN_MAP[pattern].forEach(interval => {
        count[parseNum(baseChord.replace(pattern, ''), interval)] += pattern === 'default' ? 2 : 1;
      });
  
      return count;
    }
  
    const chordSimilarity = (chord1, chord2) => {
      const kousei1 = kouseion(chord1);
      const kousei2 = kouseion(chord2);
      return 1 - Math.sqrt(kousei1.reduce((sum, count, i) => sum + (count - kousei2[i]) ** 2, 0) / 12);
    }
  
    const chordProgressionSimilarity = (a, b) => {
      const filledChordP1 = a.map((chord, i) => chord || a[i - 1]);
      const filledChordP2 = b.map((chord, i) => chord || b[i - 1]);
      
      return filledChordP1.reduce((sum, chord, i) => sum + chordSimilarity(chord, filledChordP2[i]), 0) / 8;
    }
  
    return chordProgressionSimilarity(a, b);
  }