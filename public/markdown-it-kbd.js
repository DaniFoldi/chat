// [[kbd]]
//

function markdownitKbd(markdownit) {
  var MARKER_OPEN = '[';
  var MARKER_CLOSE = ']';
  var TAG = 'kbd';

  /*
   * Add delimiters for double occurences of MARKER_SYMBOL.
   */
  function tokenize(state, silent) {
    if (silent) {
      return false;
    }

    var start = state.pos;
    var max = state.posMax;
    var momChar = state.src.charAt(start);
    var nextChar = state.src.charAt(start + 1);

    // we're looking for two times the open symbol.
    if (momChar !== MARKER_OPEN || nextChar !== MARKER_OPEN) {
      return false;
    }

    // find the end sequence
    var end = -1;
    nextChar = state.src.charAt(start + 2);
    for (var i = start + 2; i < max && end === -1; i++) {
      momChar = nextChar;
      nextChar = state.src.charAt(i + 1);
      if (momChar === MARKER_CLOSE && nextChar === MARKER_CLOSE) {
        // found the end!
        end = i;
      }
      if (momChar === MARKER_OPEN && momChar === MARKER_OPEN) {
        // found another opening sequence before the end. Thus, ignore ours!
        return false;
      }
      if (momChar === '\n') {
        // found end of line before the end sequence. Thus, ignore our start sequence!
        return false;
      }
    }

    // start tag
    state.push('kbd_open', TAG, 1);
    // parse inner
    state.pos += 2;
    state.posMax = end;
    state.md.inline.tokenize(state);
    state.pos = end + 2;
    state.posMax = max;
    // end tag
    state.push('kbd_close', TAG, -1);

    return true;
  }

  markdownit.inline.ruler.before('link', 'kbd', tokenize);
}
