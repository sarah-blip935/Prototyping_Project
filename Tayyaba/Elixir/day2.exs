defmodule Calculator do
  def calculate(a, "+", b), do: a + b
  def calculate(a, "-", b), do: a - b
  def calculate(a, "*", b), do: a * b
  def calculate(a, "/", b) when b != 0, do: a / b
  def calculate(_a, "/", 0), do: "Error: Cannot divide by zero"
  def calculate(_a, _op, _b), do: "Error: Invalid operator"
end

# Test cases
IO.puts "Addition: #{Calculator.calculate(10, "+", 5)}"
IO.puts "Subtraction: #{Calculator.calculate(10, "-", 5)}"
IO.puts "Multiplication: #{Calculator.calculate(10, "*", 5)}"
IO.puts "Division: #{Calculator.calculate(10, "/", 5)}"
IO.puts "Division by zero: #{Calculator.calculate(10, "/", 0)}"
