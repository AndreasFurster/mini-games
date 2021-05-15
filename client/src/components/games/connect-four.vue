<template>
  <v-container class="connect-four-container">
    <v-row>
      <v-col cols="12">
        <h1>Connect Four</h1>
        <div class="move-previews">
          <div class="col" v-for="(preview, col) in movePreviews" :key="col">
            <div class="row">
              <div :class="'cell ' + preview"></div>
            </div>
          </div>
        </div>
        <div class="board">
          <div
            class="col"
            v-for="(rows, col) in boardState"
            :key="col"
            @mouseover="colHover(col)"
            @click="colClick(col)"
          >
            <div class="row" v-for="(cell, row) in rows" :key="row">
              <div :class="'cell ' + cell"></div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  inject: ['socket'],
  data: () => ({
    turn: "red",
    boardState: null,
    movePreviews: [],
  }),
  created() {
    this.resetBoardState()
    this.resetMovePreviews()
  },
  mounted() {
    this.socket.on('games/connectfour/move', (col) => {
      this.doMove(col)
    });
  },
  methods: {
    resetBoardState() {
      const boardState = [];

      for (let col = 0; col < 7; col++) {
        if (!boardState[col]) boardState[col] = [];

        for (let row = 0; row < 6; row++) {
          boardState[col][row] = "blank";
        }
      }

      this.boardState = boardState;
    },
    resetMovePreviews() {
      for (let col = 0; col < 7; col++) {
        this.movePreviews[col] = 'blank';
      }
    },
    colHover(colIndex) {
      this.resetMovePreviews()
      this.movePreviews[colIndex] = this.turn
    },
    colClick(col) {
      this.socket.emit('games/connectfour/move', col);
    },
    doMove(colIndex) {
      const col = this.boardState[colIndex]

      for (let i = 0; i < col.length; i++) {
        const cell = col[i];

        // If top cell is filled; just ignore.
        if(i == 0 && cell != 'blank') {
          break;
        }

        // If cell is not filled, fill previous cell and swap turn
        else if(cell != 'blank') {
          this.boardState[colIndex][i - 1] = this.turn
          this.swapTurn()
          break
        }

        // If buttom cell is empty, use that one
        else if(i == col.length - 1 && cell == 'blank') {
          this.boardState[colIndex][i] = this.turn
          this.swapTurn()
          break
        }
      }
    },
    swapTurn() {
      this.turn = this.turn == 'red' ? 'yellow' : 'red'
      this.resetMovePreviews()
    }
  },
};
</script>

<style scoped>
.connect-four-container {
  max-width: calc(100vh - 200px);
}

.move-previews,
.board {
  display: flex;
  justify-content: space-around;
}

.board {
  background: blue;
  border-radius: 5px;
}

.col {
  flex: 1 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.row {
  padding: 14%;
}

.cell {
  padding-top: 100%;
  width: 100%;
  position: relative;
  border-radius: 50%;
}

.move-previews .cell {
  top: 30%;
  z-index: -1;
}

.cell.blank {
  background: white;
}
.cell.red {
  background: red;
}
.cell.yellow {
  background: yellow;
}
</style>
