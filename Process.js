class Process {

    constructor(Name, SubTime, BurTime, Color) {
        this.ProcessName = Name;
        this.SubmissionTime = SubTime;
        this.BurstTime = BurTime;
        this.ProcessColor = Color;
    }

    calculateTime(StartTime) {
        this.StartTime = StartTime;
        this.WaitingTime = this.StartTime - this.SubmissionTime;
        this.TurnAroundTime = this.WaitingTime + this.BurstTime;
    }
}