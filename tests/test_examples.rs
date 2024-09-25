use std::process::{Command, Output};

fn run_example(name: &str) {
    let output: Output = Command::new("cargo")
        .args(["run", "--example", name])
        .output()
        .expect("Failed to execute example");
    assert!(output.status.success());
}

#[test]
fn test_transcode() {
    run_example("transcode");
}
