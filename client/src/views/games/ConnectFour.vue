<template>
  <el-row :gutter="20">
    <el-col :span="17">
      <el-card class="connect-four-container">
        <h2>Connect Four</h2>
        <div class="move-previews" v-if="gameStarted">
          <div class="col" v-for="(preview, col) in movePreviews" :key="col">
            <div class="row">
              <div :class="'cell ' + preview"></div>
            </div>
          </div>
        </div>
        <div class="board" v-if="gameStarted">
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
        <el-skeleton v-else animated />
      </el-card>
    </el-col>
    <el-col :span="7">
      <el-card>
        <h3 v-if="myTurn">Your turn!</h3>
        <h3 v-else>Wait for player...</h3>
        
        <el-divider></el-divider>

        <el-button type="danger" @click="clickForfeit()">Forfeit</el-button>
        <!-- <el-button type="primary">Rematch</el-button> -->

      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import router from "../../router";

export default {
  inject: ["socket"],
  data: () => ({
    gameStarted: false,
    firstTurn: null,
    myTurn: null,
    myColor: null,
    otherColor: null,
    boardState: null,
    movePreviews: [],
  }),
  created() {
    this.resetBoardState();
    this.resetMovePreviews();
  },
  mounted() {
    this.socket.emit("room/info/get");

    this.socket.on("room/error", (error) => {
      if (error == "notInRoom") {
        router.push({ name: "Home" });
      } else {
        console.error(error);
      }
    });

    this.socket.on("room/info", (info) => {
      if (!this.gameStarted) {
        // Last one joined always starts the game with red.
        this.myTurn = info.lastJoined == this.socket.id
        this.firstTurn = this.myTurn
        this.myColor = this.myTurn ? "red" : "yellow"
        this.otherColor = this.myTurn ? "yellow" : "red"
        this.gameStarted = true

        this.socket.emit("room/data", {
          alsoSendToMe: true,
          systemMessage: "The game started",
        });
      }
    });

    this.socket.on("room/data", (data) => {
      console.log('new data', data);
      if (data.move) {
        this.doMove(data.move, this.otherColor);
      }

      if(data.forfeit) {
        this.forfeit()
      }
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
        this.movePreviews[col] = "blank";
      }
    },
    colHover(colIndex) {
      if (!this.myTurn) return;

      this.resetMovePreviews();
      this.movePreviews[colIndex] = this.myColor;
    },
    colClick(col) {
      if (!this.myTurn) return;

      this.doMove(col, this.myColor);
      this.socket.emit("room/data", {
        move: col,
      });
    },
    doMove(colIndex, color) {
      const col = this.boardState[colIndex];

      for (let i = 0; i < col.length; i++) {
        const cell = col[i];

        // If top cell is filled; just ignore.
        if (i == 0 && cell != "blank") {
          break;
        }

        // If cell is not filled, fill previous cell and swap turn
        else if (cell != "blank") {
          this.boardState[colIndex][i - 1] = color;
          this.swapTurn();
          break;
        }

        // If buttom cell is empty, use that one
        else if (i == col.length - 1 && cell == "blank") {
          this.boardState[colIndex][i] = color;
          this.swapTurn();
          break;
        }
      }
    },
    swapTurn() {
      this.myTurn = !this.myTurn;
      this.resetMovePreviews();
    },
    clickForfeit() {
      this.socket.emit("room/data", {
        forfeit: true,
        systemMessage: 'You won!'
      });

      this.forfeit()
    },
    forfeit() {
      console.log('forfeit', this.firstTurn);
      this.myTurn = !this.firstTurn
      this.resetBoardState();
      this.resetMovePreviews();
    }
  },
};
</script>

<style scoped>
.connect-four-container {
  position: relative;
  max-width: calc(100vh - 200px);
}

.move-previews,
.board {
  display: flex;
  justify-content: space-around;
  padding: 1%;
}

.move-previews {
  margin-top: -50px;
}

.board {
  background: #0024b3;
  border-radius: 8px;
  z-index: 20;
  position: relative;
}

.col {
  flex: 1 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.row {
  padding: 10%;
}

.cell {
  padding-top: 100%;
  width: 100%;
  position: relative;
  border-radius: 50%;
}

.move-previews .cell {
  bottom: -30%;
  z-index: 10;
  border: 2px solid white;
  left: -2px;
}

.board .cell.red,
.board .cell.yellow {
  -webkit-box-shadow: inset 5px 5px 19px -4px rgba(17, 17, 17, 0.8);
  box-shadow: inset 5px 5px 19px -4px rgba(17, 17, 17, 0.8);
}

.move-previews .cell.red {
  border-color: #ac2224;
}

.move-previews .cell.yellow {
  border-color: #b9b40b;
}

.cell.blank {
  background: white;
}
.cell.red {
  background: #dc3436;
}
.cell.yellow {
  background: #ede40c;
}

.el-button {
  width: 100%;
  margin-left: 0 !important;
  margin-top: 5px;
}

</style>
