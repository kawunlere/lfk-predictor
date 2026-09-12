async function hmacSha256(key, message) {
  var keyData = new TextEncoder().encode(key);
  var msgData = new TextEncoder().encode(message);
  var cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  var sig = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  return new Uint8Array(sig);
}

function bytesToInt(bytes) {
  return (bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3]) >>> 0;
}

export async function analyzeMines(env, data) {
  try {
    var serverSeed = String(data.server_seed || "").trim();
    var clientSeed = String(data.client_seed || "").trim();
    var numMines = parseInt(data.num_mines) || 3;
    if (!serverSeed || !clientSeed) {
      return { ok: false, error: "Need both server and client seeds" };
    }
    if (numMines < 1 || numMines > 24) {
      return { ok: false, error: "Mines must be 1-24" };
    }
    var positions = [];
    var nonce = 0;
    while (positions.length < numMines && nonce < 100) {
      var msg = clientSeed + ":" + nonce;
      var bytes = await hmacSha256(serverSeed, msg);
      var n = bytesToInt(bytes);
      var pos = n % 25;
      if (positions.indexOf(pos) === -1) {
        positions.push(pos);
      }
      nonce++;
    }
    var grid = [];
    for (var r = 0; r < 5; r++) {
      var row = [];
      for (var c = 0; c < 5; c++) {
        var p = r * 5 + c;
        row.push({ pos: p, row: r, col: c, isMine: positions.indexOf(p) !== -1 });
      }
      grid.push(row);
    }
    return { ok: true, grid: grid, minePositions: positions, confidence: 80, numMines: numMines };
  } catch (e) {
    return { ok: false, error: "Error: " + String(e.message || e) };
  }
}
