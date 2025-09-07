const TodoInputs = () => {
  return (
    <>
      <TextInput
        label="Task"
        value={todoInput.task}
        onChange={(e) => setTodoInput({ ...todoInput, task: e.target.value })}
      />
      <Textarea
        label="Description"
        value={todoInput.description}
        onChange={(e) =>
          setTodoInput({ ...todoInput, description: e.target.value })
        }
      />
      <Stack gap="xs">
        <Text size="sm">Priority</Text>
        <SegmentedControl
          withItemsBorders={false}
          data={[
            { label: "Low", value: "1" },
            { label: "Medium", value: "2" },
            { label: "High", value: "3" },
          ]}
          value={todoInput.priority}
          onChange={(e) =>
            setTodoInput({ ...todoInput, priority: e as "1" | "2" | "3" })
          }
        />
      </Stack>
      <DateTimePicker
        label="Start"
        valueFormat="DD MMMM YYYY H:mm"
        value={todoInput.start}
        onChange={(newStart) => {
          setTodoInput({ ...todoInput, start: newStart });
        }}
        clearable
      />
      <DateTimePicker
        label="End"
        valueFormat="DD MMMM YYYY H:mm"
        value={todoInput.end}
        onChange={(newEnd) => setTodoInput({ ...todoInput, end: newEnd })}
        clearable
      />
      <TagInput todoInput={todoInput} setTodoInput={setTodoInput} />
    </>
  );
};

export default TodoInputs;
