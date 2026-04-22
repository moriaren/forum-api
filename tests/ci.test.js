describe('CI Scenario - Fail First', () => {
  it('should fail intentionally', () => {
    expect(1 + 1).toBe(3); // ❌ sengaja salah
  });
});